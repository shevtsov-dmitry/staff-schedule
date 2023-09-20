CREATE VIEW show_employees_shifts AS
SELECT emloyee_table.first_name,
       emloyee_table.last_name,
       shift_schedule_table.shift_start_time,
       shift_schedule_table.shift_end_time
FROM employee emloyee_table
         JOIN employee_shiftschedule employee_shiftschedule_table
              ON emloyee_table.employee_id = employee_shiftschedule_table.employee_id
         JOIN shift_schedule shift_schedule_table
              ON employee_shiftschedule_table.shift_schedule_id = shift_schedule_table.shift_schedule_id;