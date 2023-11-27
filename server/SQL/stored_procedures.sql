CREATE OR REPLACE PROCEDURE assign_employee_to_shift(
    IN p_shift_id INTEGER,
    IN p_employee_id INTEGER
)
AS
$$
BEGIN
    UPDATE employee_shiftschedule
    SET employee_id = p_employee_id
    WHERE shift_schedule_id = p_shift_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_available_employees(
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME
)
    RETURNS TABLE
            (
                employee_id INTEGER,
                first_name  VARCHAR(255),
                last_name   VARCHAR(255)
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT e.employee_id, e.first_name, e.last_name
        FROM employee e
        WHERE e.employee_id NOT IN (SELECT ss.employee_id
                                    FROM shift_schedule ss
                                    WHERE ss.date = p_date
                                      AND (
                                            (ss.shift_start_time <= p_start_time AND ss.shift_end_time > p_start_time)
                                            OR (ss.shift_start_time < p_end_time AND ss.shift_end_time >= p_end_time)
                                            OR (ss.shift_start_time >= p_start_time AND ss.shift_end_time <= p_end_time)
                                        ));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE calculateEmployeeBonus(
    IN p_employee_id INT,
    IN p_bonus_coefficient DECIMAL
) AS
$$
DECLARE
    v_employee_salary DECIMAL;
    v_new_salary      DECIMAL;
BEGIN
    SELECT salary
    INTO v_employee_salary
    FROM salary_record
    WHERE employee_id = p_employee_id;

    v_new_salary := v_employee_salary * (1 + p_bonus_coefficient);

    UPDATE salary_record
    SET salary = v_new_salary
    WHERE employee_id = p_employee_id;

    COMMIT;
END;
$$
    LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE sp_DeleteDepartment(
    department_id INTEGER
)
AS
$$
BEGIN
    DELETE
    FROM employee
    WHERE employee.department_id = sp_DeleteDepartment.department_id;

    DELETE
    FROM job
    WHERE job.department_id = sp_DeleteDepartment.department_id;

    DELETE
    FROM department
    WHERE department.department_id = sp_DeleteDepartment.department_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE sp_UpdateSalary(
    employee_id INTEGER,
    salary NUMERIC(10, 2)
)
AS
$$
BEGIN
    UPDATE salary_record
    SET salary = sp_UpdateSalary.salary
    WHERE salary_record.employee_id = sp_UpdateSalary.employee_id;
END;
$$ LANGUAGE plpgsql;

