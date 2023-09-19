CREATE TABLE IF NOT EXISTS department
(
    department_id      serial not null primary key,
    department_name    varchar(255),
--     department_manager_id int,
    department_budget  numeric(10, 2),
    location_id        integer
);

CREATE TABLE IF NOT EXISTS employee
(
    employee_id   serial not null primary key,
    first_name    varchar(255),
    last_name     varchar(255),
    phone_number  varchar(20),
    email         varchar(255),
    hire_date     date,
    department_id integer,
    position_id   integer
);

CREATE TABLE IF NOT EXISTS job
(
    job_id           serial not null primary key,
    job_title        varchar(255),
    job_description  text,
    job_requirements text,
    department_id    integer,
    position_id      integer
);

CREATE TABLE IF NOT EXISTS location
(
    location_id    serial not null primary key,
    location_name  varchar(255),
    address_line_1 varchar(255),
    address_line_2 varchar(255),
    city           varchar(255),
    region         varchar(255),
    zip_code       varchar(20),
    country        varchar(50)
);

CREATE TABLE IF NOT EXISTS position
(
    position_id             serial not null primary key,
    position_title          varchar(255),
    position_description    text,
    required_hours_per_week double precision

);

CREATE TABLE IF NOT EXISTS salary_record
(
    salary_record_id  serial not null primary key,
    salary            numeric(10, 2),
    hourly_rate       numeric(10, 2),
    bonus_coefficient numeric(10, 2),
    employee_id       integer
);


CREATE TABLE IF NOT EXISTS shift_schedule
(
    shift_schedule_id serial not null primary key,
    shift_start_time  time,
    shift_end_time    time
--     shift_date        date
);

-- MANY TO MANY
CREATE TABLE IF NOT EXISTS employee_shiftSchedule
(
    employee_id       int,
    shift_schedule_id int
);


ALTER TABLE department
    ADD CONSTRAINT fk_department_location_id FOREIGN KEY (location_id) REFERENCES location (location_id);
-- ALTER TABLE department
--     ADD CONSTRAINT fk_department_employee_id FOREIGN KEY (department_manager_id) REFERENCES employee(employee_id);

ALTER TABLE employee
    ADD CONSTRAINT fk_employee_department_id FOREIGN KEY (department_id) REFERENCES department (department_id);
ALTER TABLE employee
    ADD CONSTRAINT fk_employee_position_id FOREIGN KEY (position_id) REFERENCES position (position_id);

ALTER TABLE job
    ADD CONSTRAINT fk_job_department_id FOREIGN KEY (department_id) REFERENCES department (department_id);
ALTER TABLE job
    ADD CONSTRAINT fk_job_position_id FOREIGN KEY (position_id) REFERENCES position (position_id);


ALTER TABLE salary_record
    ADD CONSTRAINT fk_salary_record_employee_id FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE employee_shiftSchedule
    ADD CONSTRAINT fk_employee_shiftSchedule_employee_id FOREIGN KEY (employee_id) REFERENCES employee (employee_id);
ALTER TABLE employee_shiftSchedule
    ADD CONSTRAINT fk_employee_shiftSchedule_shift_schedule_id FOREIGN KEY (shift_schedule_id) REFERENCES shift_schedule (shift_schedule_id);

CREATE TABLE IF NOT EXISTS admins
(
    id       serial primary key not null,
    login    varchar(20),
    password varchar(20)
);
