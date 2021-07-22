// const mysql = require('mysql2');
// const db = require('../db/connection');
// const inquirer = require('inquirer');
// const { addHandler, viewHandler } = require('./handlers');

// function mainLoop() {
//     inquirer.prompt([
//         {
//             type: 'list',
//             name: 'next',
//             message: 'What would you like to do?',
//             choices: [
//                 'view all departments',
//                 'view all roles',
//                 'view all roles',
//                 'view all employees',
//                 'add a department',
//                 'add a role',
//                 'add an employee',
//                 'update an employee role',
//                 'quit'
//             ]
//         }
//     ]).then((answers) => {
//         if (answers.next.charAt(0) === 'v') {
//             viewHandler(answers.next)
//         } else if (answers.next.charAt(0) === 'a' || answers.next.charAt(0) === 'u') {
//             addHandler(answers.next);
//         } else if (answers.next === 'quit') {
//             console.log(`
// --------------------------------------------------------
//         Thank you for using the Employee Tracker!
// --------------------------------------------------------
// `           );
//             return false;
//         }
//     });
// }

// async function addDepart() {
//     const sql = 'INSERT INTO department (dep_name) VALUES (?)'
//     let data = await inquirer.prompt([
//         {
//             name: 'depart',
//             type: 'input',
//             message: 'What is the name for the new department?' 
//         },
//     ]);
//     data = [data.depart];
//     db.query(sql, data, (err, rows) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('Successfully Added ' + data[0]);
//     });
//     mainLoop();
// }

// function addRole() {

// }

// function addEmployee() {

// }

// function updateEmployee() {

// }

// module.exports = {addDepart, addRole, addEmployee, updateEmployee, mainLoop};