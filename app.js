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
            return false;
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
            addRole();
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

async function addRole() {
    const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)'
    let depart = await db.query('SELECT department.depart_name FROM department;', (err, rows) => {

    });
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
            name: 'd_id',
            type: 'number',
            message: 'What is the ID of the department this role is a part of?'
        }
    ]);
    data = [data.title, data.salary, data.d_id];
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Added ' + data[0]);
        mainLoop();
    });
}

async function addEmployee() {
    const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager) VALUES (?, ?, ?)'
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
            name: 'd_id',
            type: 'number',
            message: 'What is the ID of the department this role is a part of?'
        }
    ]);
    data = [data.title, data.salary, data.d_id];
    db.query(sql, data, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully Added ' + data[0]);
        mainLoop();
    });
}

function updateEmployee() {

}

initialize();

