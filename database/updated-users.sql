ALTER TABLE users
ADD COLUMN employee_code VARCHAR(20),
ADD COLUMN department_id BIGINT,
ADD COLUMN manager_id BIGINT,
ADD COLUMN designation VARCHAR(100),
ADD COLUMN salary DECIMAL(10,2),
ADD COLUMN joining_date DATE;




ALTER TABLE users
ADD CONSTRAINT fk_user_department
FOREIGN KEY (department_id)
REFERENCES departments(id);



ALTER TABLE users
ADD CONSTRAINT fk_user_manager
FOREIGN KEY (manager_id)
REFERENCES users(id);