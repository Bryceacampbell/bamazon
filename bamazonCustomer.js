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
    console.log("successful connection");
    displayProducts();
});

//Display Products===============================================================

function displayProducts() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;

            let table = new Table({
                head: ["item_id", "product_name", "department_name", "price"],
                colWidths: [20, 20, 20, 20]
            });

            for (let i = 0; i < res.length; i++) {
                let itemId = res[i].item_id;
                let productName = res[i].product_name;
                let departmentName = res[i].department_name;
                let productPrice = res[i].price;
                table.push(
                    [itemId, productName, departmentName, productPrice]
                );
            }

            console.log(table.toString());
            start();
        }
    );
};

//Update Products=================================================================

function updateProduct(productSelection, updatedQuantity) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [updatedQuantity, productSelection],
        function (err, res, fields) {
            if (err) {
                console.log(err);
                return;
            }
        }
    );
};



function start() {

    inquirer.prompt([
        {
            type: "input",
            name: "productSelection",
            message: "What is the ID of the product you would like to buy?"
        },
        {
            type: "input",
            name: "selectionQuantity",
            message: "How many would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function (answers) {

        let productSelection = answers.productSelection;
        let selectionQuantity = parseInt(answers.selectionQuantity);

        connection.query(
            "SELECT * FROM products WHERE item_id = " + productSelection,
            function (err, res, fields) {

                if (err) {
                    console.log(err);
                    return;
                }

                let currentQuantity = parseInt(res[0].stock_quantity);
                let productPrice = res[0].price;

                if (selectionQuantity > currentQuantity) {
                    console.log("\n Insufficient Quantity\n There is only " + currentQuantity + " left in stock\n Please Try Again\n")
                    connection.end();
                }
                else {
                    inquirer.prompt([
                        {
                            name: "confirmPurchase",
                            type: "list",
                            message: "This item costs $" + productPrice + ". Do you wish to proceed?",
                            choices: ["BUY", "EXIT"]
                        }
                    ]).then(function (answers) {

                        if (answers.confirmPurchase === "BUY") {
                            console.log("\nPurchase Successful\nThank you & come again!");
                            let updatedQuantity = currentQuantity - selectionQuantity;
                            updateProduct(productSelection, updatedQuantity);
                            connection.end();
                        }
                        else {
                            connection.end();
                        }
                    });
                }
            }
        );
    });
};