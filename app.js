const mysql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

function initialize() {
    console.log(`
--------------------------------------------------------
            Welcome to the Employee Tracker!
--------------------------------------------------------
`);

mainLoop();
}

function mainLoop() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'next',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'quit'
            ]
        }
    ]).then((answers) => {
        if (answers.next.charAt(0) === 'v') {
            viewHandler(answers.next)
        } else if (answers.next.charAt(0) === 'a' || answers.next.charAt(0) === 'u') {
            addHandler(answers.next);
        } else if (answers.next === 'quit') {
            console.log(`
--------------------------------------------------------
        Thank you for using the Employee Tracker!
--------------------------------------------------------
`           );
            process.exit();
        }
    });
}

function viewHandler(answer) {
    let table = null;
    let sql = null;
    if (answer === 'view all departments') {
        table = 'department';
        sql = 'SELECT * FROM department';
    } else if (answer === 'view all roles') {
        table = 'roles';
        sql = 'SELECT roles.*, department.dep_name FROM roles LEFT JOIN department ON roles.department_id = department.id;'
    } else if (answer === 'view all employees') {
        table = 'employee';
         sql = 'SELECT employee.*, manager.first_name AS manager, roles.title AS role, CONCAT(employee.first_name, " ",  employee.last_name) AS full_name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN employee manager ON employee.manager_id = manager.id;'
    }

    executeViewHandler(table, sql);
}

function executeViewHandler(table, sql) {
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        let tableArray = [];
        switch (table) {
            case 'department':
            tableArray = rows.map(row => {
                let depart = {};
                depart['ID'] = row.id;
                depart['Departments'] = row.dep_name;
                return depart;
            });
            break;

            case 'roles':
                tableArray = rows.map(row => {
                    let depart = {};
                    depart['ID'] = row.id;
                    depart['Role'] = row.title;
                    depart['Salary'] = row.salary;
                    depart['Dep id'] = row.department_id;
                    depart['Department'] = row.dep_name;
                    return depart;
                });
            break;

            case 'employee':
                tableArray = rows.map(row => {
                    let depart = {};
                    depart['ID'] = row.id;
                    depart['Full Name'] = row.full_name;
                    depart['Role'] = row.role;
                    depart['Manager'] = row.manager;
                    depart['Management'] = row.is_manager ? 'Yes' : 'No';  
                    // this is an if / else called a conditional operator. Used for simple operations of if / else
                    return depart;
                });
            break;
        }
        printTable(tableArray);
        mainLoop();
    });
}

function addHandler(answer) {
    switch (answer) {
        case 'add a department':
        addDepart();
        break;
        
        case 'add a role':
            let depart = [];
            db.query('SELECT * FROM department;', (err, rows) => {
                depart = rows.map(row => {
                    return (row.id + '. ' +  row.dep_name);
                });
                addRole(depart);
            });
            
        break;

        case 'add an employee':
            
            let managers = []
            const sql = `SELECT employee.id AS employee_id, concat(employee.first_name, " ", employee.last_name) AS full_name
            FROM employee WHERE employee.is_manager = 1;`;
            db.query(sql, (err, rows) => {
                managers = rows.map(row => {
                    return (row.employee_id + '. ' +  row.full_name);
                });
                let roles = [];
                db.query('SELECT roles.id, roles.title FROM roles;', (err, rows) => {
                    roles = rows.map(row => {
                        return (row.id + '. ' +  row.title);
                    });
                    addEmployee(roles, managers);
                });
            });
            
        break;

        case 'update an employee role':
            let employees = []
            const sql_ = 'SELECT employee.id AS employee_id, concat(employee.first_name, " ", employee.last_name) AS full_name FROM employee;';
            db.query(sql_, (err, rows) => {
                employees = rows.map(row => {
                    return (row.employee_id + '. ' +  row.full_name);
                });
                let roles = [];
                db.query('SELECT roles.id, roles.title FROM roles;', (err, rows) => {
                    roles = rows.map(row => {
                        return (row.id + '. ' +  row.title);
                    });
                    updateEmployee(roles, employees);
                });
            });
        break;
    }
}

async function addDepart() {
    const sql = 'INSERT INTO department (dep_name) VALUES (?)'
    let data = await inquirer.prompt([
        {
            name: 'depart',
            type: 'input',
            message: 'What is the name for the new department?' 
        },
    ]);

    data = [data.depart];
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Added ' + data[0]);
        mainLoop();
    });
}

async function addRole(depart) {
    const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)'
    
    let data = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the name for the new role' 
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'What department id this role is a part of?',
            choices: depart
        }
    ]);
    let tempDep = data.department.split('.');
    let dep = parseInt(tempDep[0]);

    data = [data.title, data.salary, dep];
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Added ' + data[0]);
        mainLoop();
    });
}

async function addEmployee(roles, managers) {
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager) VALUES (?, ?, ?, ?, ?)'
    let data = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the employees first name?' 
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the employees last name?'
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is this employees role?',
            choices: roles
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Who is their manager? (can be blank)',
            choices: managers
        },
        {
            name: 'is_manager',
            type: 'confirm',
            message: 'Is this employee a manager?'
        }
    ]);
    let tempRole = data.role.split('.');
    let tempManager = data.manager.split('.');
    let role = parseInt(tempRole[0]);
    let manager = parseInt(tempManager[0]);
    let is_manager = data.is_manager? 1 : 0;

    data = [data.first_name, data.last_name, role, manager, is_manager];
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Added ' + data[0] + ' ' + data[1]);
        mainLoop();
    });
}

async function updateEmployee(roles, employees) {
    const sql = 'UPDATE employee SET role_id = ? WHERE employee.id = ?'
    let data = await inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'What employee do you want to update?',
            choices: employees 
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is this employees new role?',
            choices: roles
        }
    ]);
    let tempRole = data.role.split('.');
    let tempEmployee = data.employee.split('.');
    let role = parseInt(tempRole[0]);
    let employee = parseInt(tempEmployee[0]);

    data = [role, employee];
    console.log(data)
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Updated Employee');
        mainLoop();
    });
}

initialize();

