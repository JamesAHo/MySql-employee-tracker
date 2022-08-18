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
    InitialPrompt();
});

// Make InitialPrompt
function InitialPrompt() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Please choose options below',
        choices: [
            "See Employee",
            "View Employee by department",
            'Remove Employee from database',
            "Add Employee to database",
            'Update Role',
            'Exit'
        ]
        // Using Switch case statement
    }).then((task) => {
        switch (task.action) {
            case "See Employee":
                //pass in a function for See employee
                SeeEmployee();
                break;
            case "View Employee by department":
                SeeEmployeeByDepartment();
                break;
            case "Remove Employee from database":
                RemoveEmployeeFromDatabase('delete')
                break;
            case "Add Employee to database":
                AddEmployeeToDatabase()
                break;
            case "Update Role":
                UpdateRole();
                break;     
            case "Exit":
                connection.end()
        }
    })
};
// SeeEmployee() Function
function SeeEmployee(){
    //  do query to access employee table, SELECT all data from employee then role table
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
     connection.query(query, (err,res) => {
        if(err) throw err;
        console.table(res);
        console.log("==========Looking at  All Employee!\n==========");
        // passin InitialPrompt
        InitialPrompt()
     }) 
     // SeeEmployee prompt successfull done and show table on terminal
}
// Now we doing SeeEmployeeByDepartment() to make the prompt work
function SeeEmployeeByDepartment() {
    // do query to access employee by department
    // make const query 
    const query = `SELECT department.name AS department, role.title,role.salary, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err,res) => {
        if(err) throw err;
        console.table(res)
        console.log("==========Looking at Employee by Department!==========")
        InitialPrompt()   
    })
    // Successfully View employee by department
}

// Using Async function 

async function RemoveEmployeeFromDatabase() {
    const answer = await inquirer.prompt([
       { name: "first",
        type: 'input',
        message: "Please provide employee ID"}
    ]);
    connection.query('DELETE FROM employee WHERE ?',{id: answer.first},function (err) {if(err) throw err});
    console.log('==========EMPLOYEE successfully removed==========')
    InitialPrompt()
};
// add employee to database
async function AddEmployeeToDatabase() {
    const addname = await inquirer.prompt(UserInput());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee successfully added, view employee table for more information');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    InitialPrompt();

                }
            );
        });
    });
}
function UserInput() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Please provide first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Please provide last name: "
        }
    ]);
}
function IdInput() {
    return ([
        {
            name: "name",
            type: "input",
            message: "Please provide employee ID?:  "
        }
    ]);
}
async function UpdateRole(input) {
    const employeeId = await inquirer.prompt(IdInput());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('==========ROLE UPDATED!!!==========')
           InitialPrompt()
        });
    });

}
