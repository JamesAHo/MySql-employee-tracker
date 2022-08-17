require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table")

const connection = mysql.createConnection({
    host: 'localhost',
    Port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
})

connection.connect(err => {
    if(err) throw err;
    prompt();
});