
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;
CREATE TABLE department(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use employees_db;
INSERT INTO department (name) VALUES ('Marketing'), ('Players'), ('TeamCEO'), ('Team Manager');
INSERT INTO role (title, salary , department_id)
VALUES ('Manager', 150000, 1), ('Coach', 75000, 1), ('Leader', 100000, 2), ('Team Leader Assistant', 60000, 2), ('Media Specialist', 70000, 3), 
('Team Recruiter', 70000, 3), ('CEO', 5000000, 4), ('CEO Assistant', 2500000, 4);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('James', 'Anh', 3, NULL),('Banana', 'Malone', 2, 1),('Monkey', 'Mark', 3, NULL),('Kevin', 'Hart', 4, 3),('Bella', 'Kemp', 5, NULL),('Jenny', 'Luong', 6, 5),('Christine', 'Johnson', 7, NULL),('Stefan', 'Bird', 8, 7);