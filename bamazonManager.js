// Dependencies===================================================================

let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");

//Creating connection to MySQL Server=============================================

let connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        console.log("error connecting: " + err.stack);
        return;
    };
    console.log("successful connection\n");
    start();
});

function start() {
    inquirer.prompt([
        {
            name: "selectedOption",
            type: "list",
            message: "Hello, what would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }
    ]).then(function (answers) {

        let selectedOption = answers.selectedOption;

        switch (selectedOption) {
            case "View Products for Sale":
                //then do something
                break;
                case "View Low Inventory":
                //then do something
                break;
                case "Add to Inventory":
                //then do something
                break;
                case "Add New Product":
                //then do something
                break;
            default:
                connection.end();
                break;
        }
    })
}



