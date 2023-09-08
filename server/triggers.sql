-- Триггер «check_shift_overlap»
CREATE OR REPLACE FUNCTION check_shift_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for overlapping shifts within the same department and location
  IF EXISTS (
    SELECT 1
    FROM shift_schedule ss
    WHERE ss.employee_id = NEW.employee_id
      AND ss.date = NEW.date
      AND ss.job_id = NEW.job_id
      AND ss.shift_id != NEW.shift_id
      AND (
        (NEW.shift_start_time >= ss.shift_start_time AND NEW.shift_start_time < ss.shift_end_time) OR
        (NEW.shift_end_time > ss.shift_start_time AND NEW.shift_end_time <= ss.shift_end_time) OR
        (ss.shift_start_time >= NEW.shift_start_time AND ss.shift_start_time < NEW.shift_end_time) OR
        (ss.shift_end_time > NEW.shift_start_time AND ss.shift_end_time <= NEW.shift_end_time)
      )
  ) THEN
    RAISE EXCEPTION 'Shift overlap detected for employee % on %', NEW.employee_id, NEW.date;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shift_overlap_trigger
    BEFORE INSERT OR UPDATE ON shift_schedule
                         FOR EACH ROW
                         EXECUTE FUNCTION check_shift_overlap();



-- Триггер «prevent_department_deletion»
CREATE OR REPLACE FUNCTION prevent_department_deletion()
RETURNS TRIGGER AS $$
DECLARE
employee_count INTEGER;
    location_count INTEGER;
BEGIN
    -- Check if there are any employees referencing the department being deleted
SELECT COUNT(*) INTO employee_count
FROM employee
WHERE department_id = OLD.department_id;

-- Check if there are any locations referencing the department being deleted
SELECT COUNT(*) INTO location_count
FROM location
WHERE department_id = OLD.department_id;

IF employee_count > 0 OR location_count > 0 THEN
        RAISE EXCEPTION 'Cannot delete department with associated employees or locations';
END IF;

RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_department_deletion
    BEFORE DELETE ON department
    FOR EACH ROW
    EXECUTE FUNCTION prevent_department_deletion();




-- Триггер «auto_assign_shift_supervisor»
CREATE OR REPLACE FUNCTION auto_assign_shift_supervisor()
RETURNS TRIGGER AS $$
DECLARE
supervisor_id INTEGER;
BEGIN
    -- Retrieve the department manager's employee ID
SELECT department_manager INTO supervisor_id
FROM department
WHERE department_id = (
    SELECT department_id
    FROM employee
    WHERE employee_id = NEW.employee_id
);

-- Update the shift supervisor column with the department manager's name
UPDATE shift_schedule
SET shift_supervisor = (
    SELECT CONCAT(first_name, ' ', last_name)
    FROM employee
    WHERE employee_id = supervisor_id
)
WHERE shift_id = NEW.shift_id;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_shift_supervisor_trigger
    AFTER INSERT ON shift_schedule
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_shift_supervisor();



-- Триггер «enforce_max_hours_per_week»
CREATE OR REPLACE FUNCTION enforce_max_hours_per_week()
RETURNS TRIGGER AS $$
DECLARE
total_hours numeric;
  max_hours_per_week numeric;
BEGIN
  -- Calculate the total number of hours scheduled for the employee in a week
SELECT SUM(EXTRACT(HOUR FROM (ss.shift_end_time - ss.shift_start_time))) INTO total_hours
FROM shift_schedule ss
WHERE ss.employee_id = NEW.employee_id
  AND ss.date >= (NEW.date - interval '6 days')
  AND ss.date <= NEW.date;

-- Get the maximum hours per week allowed for the employee's position
SELECT p.hours_per_week INTO max_hours_per_week
FROM position p
WHERE p.position_id = NEW.position_id;

-- Check if the total hours exceed the maximum hours per week
IF total_hours > max_hours_per_week THEN
    RAISE EXCEPTION 'Employee % has exceeded the maximum hours per week limit of %. Current total: %', NEW.employee_id, max_hours_per_week, total_hours;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER max_hours_per_week_trigger
    BEFORE INSERT OR UPDATE ON shift_schedule
                         FOR EACH ROW
                         EXECUTE FUNCTION enforce_max_hours_per_week();
