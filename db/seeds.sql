INSERT INTO department
(dep_name)
VALUES
('Support Staff'),
('Developers'),
('Networking'),
('Financail'),
('Corprate');


INSERT INTO roles
(title, salary, department_id)
VALUES
('Intern', NULL, 2),
('Front Desk', 30000, 1),
('Maintenace', 25000, 1),
('Security', 35000, 1),
('Software Engineer', 85000, 2),
('Networking Engineer', 80000, 3),
('Accountant', 65000, 4),
('Manager', 100000, 1),
('Head Software Engineer', 120000, 2),
('Head Network Engineer', 110000, 3),
('Head Accountant', 100000, 4),
('Department Manager', 150000, 5);

INSERT INTO employee 
(first_name, last_name, role_id, manager_id, is_manager)
VALUES
('Ryan', 'Jepson', 12, NULL, 1),
('Tommy', 'Harrington', 12, NULL, 1),
('Connie', 'Taylor', 11, 2, 1), 
('Kristen', 'Griffin', 10, 1, 1),
('Ashley', 'Webster', 9, 1, 1), 
('Eloise', 'Crawford', 8, 2, 1), 
('Kristin', 'Bell', 7, 3, 0),
('Kent', 'Castro', 6, 4, 0),
('Andres', 'Alvarado', 6, 4, 0),
('Jose', 'Wood', 5, 5, 0),
('Ken', 'Hoffman', 5, 5, 0),
('Sergio', 'Ruiz', 4, 6, 0),
('Olivia', 'Barnes', 3, 6, 0),
('Lee', 'Gross', 2, 6, 0);
