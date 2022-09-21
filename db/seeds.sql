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

INSERT INTO roles (title, salary)
VALUES  ("HR Generalist", 50000),
        ("Desktop Support", 55000),
        ("Facilities Specialist", 40000),
        ("Machine Operator", 35000);

INSERT INTO employees (first_name, last_name, role_id)
VALUES  ("Sam", "Harry", 5),
        ("Terry", "Moore", 6),
        ("Cedric", "Davis", 7),
        ("Blane", "McDowell", 8);
