const { prompt } = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
// const { compilePseudoSelector } = require('css-select/lib/pseudo-selectors');

updateDatabase();

function updateDatabase() {
    prompt([
        {
            type: 'list',
            name: "task",
            message: "What would you like to do?",
            choices: ['View All Employees', 'View All Managers', 'View All Roles', 'View All Departments', 'Add Department', 'Add Role', 'Add Employee', 'Add Manager', 'Update Employee Role'],
        },
    ]).then(async ({ task }) => {
        if (task == 'View All Departments') {
            db.promise().query('SELECT departments.name AS department, concat(managers.first_name, " ", managers.last_name) AS manager FROM departments INNER JOIN managers ON departments.manager_id=managers.id;').then(data => {
                console.table(data[0]);
                updateDatabase();
            });
        };

        if (task == 'View All Employees') {
            db.promise().query('SELECT employees.first_name, employees.last_name, roles.title, roles.salary FROM employees INNER JOIN roles ON employees.role_id=roles.id;')
                .then(data => {
                    console.table(data[0]);
                    updateDatabase();
                });
        };

        if (task == 'View All Managers') {
            db.promise().query('SELECT managers.first_name, managers.last_name, departments.name AS department FROM managers INNER JOIN departments ON managers.id=departments.manager_id;')
                .then(data => {
                    console.table(data[0]);
                    updateDatabase();
                });
        };

        if (task == 'View All Roles') {
            db.promise().query('SELECT roles.title AS role, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON departments.id=roles.department_id;').then(data => {
                console.table(data[0]);
                updateDatabase();
            });
        };

        if (task == 'Add Department') {
            let managers = await db.promise().query('SELECT CONCAT(first_name, " ",last_name) AS name, id AS value FROM managers')

            prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the department name?'
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who will be the manager of the department?',
                    choices: managers[0]
                }
            ]).then(departmentData => {

                db.promise().query(`INSERT INTO departments SET ?`, departmentData).then(data => {
                    updateDatabase();
                });
            })
        };

        if (task == 'Add Role') {
            let departments = await db.promise().query('SELECT name, id AS value FROM departments');

            prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of this role?'
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'What is the salary for this position?'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Which department the role belongs to?',
                    choices: departments[0]
                }
            ])
                .then(roleData => {

                    db.promise().query(`INSERT INTO roles SET ?`, roleData).then(data => {
                        updateDatabase();
                    });
                })
        };

        if (task == 'Add Employee') {
            let roles = await db.promise().query('SELECT title AS name, id AS value FROM roles');

            prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the employee?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the employee?'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Which role will the employee have?',
                    choices: roles[0]
                }
            ])
                .then(empData => {
                    db.promise().query(`INSERT INTO employees SET ?`, empData).then(data => {
                        updateDatabase();
                    });
                })
        };

        if (task == 'Add Manager') {

            prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the manger\'s first name?',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the manager\'s last name?'
                },
                {
                    type: 'input',
                    name: 'name',
                    message: 'What department is the managers department?'
                }
            ])
                .then(manData => {
                    let firstName = manData.first_name;
                    let lastName = manData.last_name;
                    let department = manData.name;
                    let updateManagers = { firstName, lastName };

                    db.promise().query(`INSERT INTO managers SET ?`, updateManagers).then(data => {
                        db.promise().query(`SELECT * FROM managers ORDER BY id DESC LIMIT 1;`).then(data => {
                            db.promise().query(`INSERT INTO departments SET ?`, department).then(data => {
                                updateDatabase();
                            });
                        })
                    })
                });

            if (task == 'Update Employee Role') {
                let employees = await db.promise().query('SELECT CONCAT(first_name, " ",last_name) AS name, id AS value FROM employees');
                let roles = await db.promise().query('SELECT title AS name, id AS value FROM roles');

                prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: 'Which employee role do you want to update?',
                        choices: employees[0]
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What role do you want to assign to the selected employee?',
                        choices: roles[0]
                    }
                ])
                    .then(empData => {
                        db.promise().query(`UPDATE employees SET role_id=${empData.role_id} WHERE id=${empData.id}`).then(data => {
                            updateDatabase();
                        });
                    })
            };
        });

};


