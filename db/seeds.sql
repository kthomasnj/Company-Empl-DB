USE corporate_db;

INSERT INTO managers (first_name, last_name)
VALUES  ("Tom", "Brown"),
        ("Roger", "Fields"),
        ("Larry", "Bird"),
        ("Fred", "Hammonds");
        
INSERT INTO departments (name, manager_id)
VALUES  ("Human Resources", 1),
        ("Information Technology", 2),
        ("Facilities", 3),
        ("Operations", 4);

INSERT INTO roles (title, salary, department_id)
VALUES  ("HR Generalist", 50000, 1),
        ("Desktop Support", 55000, 2),
        ("Facilities Specialist", 40000, 3),
        ("Machine Operator", 35000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES  ("Sam", "Harry", 5),
        ("Terry", "Moore", 6),
        ("Cedric", "Davis", 7),
        ("Blane", "McDowell", 8);
