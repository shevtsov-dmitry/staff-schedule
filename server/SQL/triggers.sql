CREATE OR REPLACE FUNCTION check_shift_overlap()
RETURNS TRIGGER AS $$
BEGIN
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

CREATE OR REPLACE FUNCTION prevent_department_deletion()
RETURNS TRIGGER AS $$
DECLARE
employee_count INTEGER;
    location_count INTEGER;
BEGIN
SELECT COUNT(*) INTO employee_count
FROM employee
WHERE department_id = OLD.department_id;

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

CREATE OR REPLACE FUNCTION auto_assign_shift_supervisor()
RETURNS TRIGGER AS $$
DECLARE
supervisor_id INTEGER;
BEGIN
SELECT department_manager INTO supervisor_id
FROM department
WHERE department_id = (
    SELECT department_id
    FROM employee
    WHERE employee_id = NEW.employee_id
);

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

CREATE OR REPLACE FUNCTION enforce_max_hours_per_week()
RETURNS TRIGGER AS $$
DECLARE
total_hours numeric;
  max_hours_per_week numeric;
BEGIN
SELECT SUM(EXTRACT(HOUR FROM (ss.shift_end_time - ss.shift_start_time))) INTO total_hours
FROM shift_schedule ss
WHERE ss.employee_id = NEW.employee_id
  AND ss.date >= (NEW.date - interval '6 days')
  AND ss.date <= NEW.date;

SELECT p.hours_per_week INTO max_hours_per_week
FROM position p
WHERE p.position_id = NEW.position_id;

IF total_hours > max_hours_per_week THEN
    RAISE EXCEPTION 'Employee % has exceeded the maximum hours per week limit of %. Current total: %',
        NEW.employee_id, max_hours_per_week, total_hours;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER max_hours_per_week_trigger
    BEFORE INSERT OR UPDATE ON shift_schedule
                         FOR EACH ROW
                         EXECUTE FUNCTION enforce_max_hours_per_week();
