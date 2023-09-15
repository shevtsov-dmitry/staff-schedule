-- Эта хранимая процедура, ASSIGN_EMPLOYEE_TO_SHIFT, используется
-- для назначения сотрудника на определенную смену в расписании.

-- Принимает два входных параметра:
-- p_shift_id: ID смены, на которую будет назначен сотрудник.
-- p_employee_id: ID сотрудника, которому будет назначена смена.

CREATE OR REPLACE PROCEDURE assign_employee_to_shift(
    IN p_shift_id INTEGER,
    IN p_employee_id INTEGER
)
AS
$$
BEGIN
    -- Обновление таблицы shift_schedule для установки идентификатора сотрудника для указанной смены.
    -- Это связывает сотрудника (p_employee_id) со сменой (p_shift_id).
    UPDATE shift_schedule
    SET employee_id = p_employee_id
    WHERE shift_schedule_id = p_shift_id;
END;
$$ LANGUAGE plpgsql;

--  GET_AVAILABLE_EMPLOYEES
CREATE OR REPLACE FUNCTION get_available_employees(
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME
)
    RETURNS TABLE (
                      employee_id   INTEGER,
                      first_name    VARCHAR(255),
                      last_name     VARCHAR(255)
                  )
AS $$
BEGIN
    RETURN QUERY
        SELECT e.employee_id, e.first_name, e.last_name
        FROM employee e
        WHERE e.employee_id NOT IN (
            SELECT ss.employee_id
            FROM shift_schedule ss
            WHERE ss.date = p_date
              AND (
                    (ss.shift_start_time <= p_start_time AND ss.shift_end_time > p_start_time)
                    OR (ss.shift_start_time < p_end_time AND ss.shift_end_time >= p_end_time)
                    OR (ss.shift_start_time >= p_start_time AND ss.shift_end_time <= p_end_time)
                )
        );
END;
$$ LANGUAGE plpgsql;


-- CALCULATE_EMPLOYEE_BONUS
CREATE OR REPLACE FUNCTION CalculateEmployeeBonus(
    p_employee_id INTEGER,
    p_date DATE
)
    RETURNS NUMERIC(10, 2)
AS $$
DECLARE
    v_bonus_coefficient NUMERIC(10, 2);
    v_performance_score NUMERIC(10, 2);
    v_bonus_amount NUMERIC(10, 2);
BEGIN
    -- Retrieve the bonus coefficient for the employee
    SELECT bonus_coefficient
    INTO v_bonus_coefficient
    FROM salary_record
    WHERE employee_id = p_employee_id
      AND date <= p_date
    ORDER BY date DESC
    LIMIT 1;

    -- Retrieve the performance score for the employee
    SELECT performance_score
    INTO v_performance_score
    FROM employee_performance
    WHERE employee_id = p_employee_id
      AND performance_date <= p_date
    ORDER BY performance_date DESC
    LIMIT 1;

    -- Calculate the bonus amount
    v_bonus_amount := v_performance_score * v_bonus_coefficient;

    RETURN v_bonus_amount;
END;
$$ LANGUAGE plpgsql;


-- SP_DELETE_DEPARTMENT
CREATE OR REPLACE PROCEDURE sp_DeleteDepartment(
    department_id INTEGER
)
AS $$
BEGIN
    DELETE FROM employee
    WHERE department_id = sp_DeleteDepartment.department_id;

    DELETE FROM job
    WHERE department_id = sp_DeleteDepartment.department_id;

    DELETE FROM location
    WHERE department_id = sp_DeleteDepartment.department_id;

    DELETE FROM department
    WHERE department_id = sp_DeleteDepartment.department_id;
END;
$$ LANGUAGE plpgsql;




-- SP_UPDATE_SALARY
CREATE OR REPLACE PROCEDURE sp_UpdateSalary(
    employee_id INTEGER,
    position_id INTEGER,
    bonus_coefficient NUMERIC(10, 2),
    salary NUMERIC(10, 2),
    date DATE
)
AS $$
BEGIN
    UPDATE salary_record
    SET
        position_id = sp_UpdateSalary.position_id,
        bonus_coefficient = sp_UpdateSalary.bonus_coefficient,
        salary = sp_UpdateSalary.salary,
        date = sp_UpdateSalary.date
    WHERE
            employee_id = sp_UpdateSalary.employee_id;
END;
$$ LANGUAGE plpgsql;

