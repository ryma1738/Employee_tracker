// const inquirer = require('inquirer');
// const sql = require('mysql2');
// const db = require('../db/connection');
// const { printTable } = require('console-table-printer');
//  const { addDepart, addEmployee, addRole, updateEmployee, mainLoop } = require('./index');

//  function viewHandler(answer) {
//     let table = null;
//     if (answer === 'view all departments') {
//         table = 'department';
//     } else if (answer === 'view all roles') {
//         table = 'roles';
//     } else if (answer === 'view all employees') {
//         table = 'employee';
//     }

//     executeViewHandler(table);
// }

// function executeViewHandler(table, sql) {
//     db.query(sql, (err, rows) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         let tableArray = [];
//         switch (table) {
//             case 'department':
//             tableArray = rows.map(row => {
//                 let depart = {};
//                 depart['Departments'] = row.dep_name;
//                 return depart
//             });
//             break;

//             case 'roles':

//             break;

//             case 'employee':

//             break;
//         }
//         printTable(tableArray);
//         mainLoop();
//     });
// }

// function addHandler(answer) {
//     switch (answer) {
//         case 'add a department':
//         addDepart();
//         break;
//     }
// }

// module.exports = {addHandler, viewHandler};