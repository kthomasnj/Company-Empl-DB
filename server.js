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
            choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role',  'Add Department', 'Update Employee Role'],
        },
    ]).then( async ({task}) => { 
        if(task=='View All Departments') {
            db.promise().query('SELECT departments.name AS department, concat(managers.first_name, " ", managers.last_name) AS manager FROM departments INNER JOIN managers ON departments.manager_id=managers.id;').then(data=>{
                console.table(data[0]);
                updateDatabase();
            });
        };
        
        if(task=='View All Employees') {
            db.promise().query('SELECT employees.first_name, employees.last_name, roles.title, roles.salary FROM employees INNER JOIN roles ON employees.role_id=roles.id;')
            .then(data=>{
                console.table(data[0]);
                updateDatabase();
            });
        }; 
        
        if(task=='View All Roles') {
            db.promise().query('SELECT roles.title AS role, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON departments.id=roles.department_id;').then(data=>{
                console.table(data[0]);
                updateDatabase();
            });
        }; 

        if(task=='Add Department') {
            let manager = await db.promise().query('SELECT CONCAT(first_name, " ",last_name) AS name, id AS value FROM employees')

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
                    choices: manager[0]
                }
            ]).then(departmentData => {
                
                db.promise().query(`INSERT INTO departments SET ?`,departmentData).then(data=>{
                    updateDatabase();
                });
            })
        }; 
        
        if(task=='Add Role') {

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
                
                db.promise().query(`INSERT INTO roles SET ?`,roleData).then(data=>{
                    updateDatabase();
                });
            })
        }; 

        if(task=='Add Employee') {
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
                db.promise().query(`INSERT INTO employees SET ?`,empData).then(data=>{
                    updateDatabase();
                });
            })
        }; 

    });

};


