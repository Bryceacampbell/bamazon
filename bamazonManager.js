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
                displayProducts();
                connection.end();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                connection.end();
                break;
        };
    });
};

function displayProducts() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;

            let table = new Table({
                head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
                colWidths: [20, 20, 20, 20, 20]
            });

            for (let i = 0; i < res.length; i++) {
                let itemId = res[i].item_id;
                let productName = res[i].product_name;
                let departmentName = res[i].department_name;
                let productPrice = res[i].price;
                let stockQuantity = res[i].stock_quantity;
                table.push(
                    [itemId, productName, departmentName, productPrice, stockQuantity]
                );
            };
            console.log("\n" + table.toString());
            return;
        }
    );
};

function viewLowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {

            if (err) throw err;

            let table = new Table({
                head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
                colWidths: [20, 20, 20, 20, 20]
            });

            for (let i = 0; i < res.length; i++) {

                let itemId = res[i].item_id;
                let productName = res[i].product_name;
                let departmentName = res[i].department_name;
                let productPrice = res[i].price;
                let stockQuantity = res[i].stock_quantity;
                table.push(
                    [itemId, productName, departmentName, productPrice, stockQuantity]
                );
            };

            console.log(table.toString());
            connection.end();
        }
    );
};

function addToInventory() {

    displayProducts()

    inquirer.prompt([
        {
            type: "input",
            name: "selectedItem",
            message: "What is the id of the product you want to update?"
        },
        {
            type: "input",
            name: "stockInput",
            message: "The amount of stock you are adding?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {

        let selectedItem = answers.selectedItem;
        let selectionQuantity = answers.stockInput;

        connection.query(
            "SELECT stock_quantity FROM products WHERE item_id = ?",
            [selectedItem],
            function (err, res, fields) {

                if (err) throw err;

                let updatedQuantity = res[0].stock_quantity + parseInt(selectionQuantity);

                connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                    [updatedQuantity, selectedItem],
                    function (err, res, fields) {
                        if (err) throw err;
                    }
                );

                console.log("Successfully updated!!")
                connection.end();
            }
        );
    });
};

function addNewProduct() {

    inquirer.prompt([
        {
            type: "input",
            name: "newProductName",
            message: "What is the name of the new product?"
        },
        {
            type: "list",
            name: "departmentName",
            message: "Which department is this product associated with?",
            choices: ["Clothing", "Electronics", "Luggage", "Jewelery"]
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of this product?"
        },
        {
            type: "input",
            name: "stockQuantity",
            message: "How much stock is available?"
        }
    ]).then(function (answers) {

        let newProductName = answers.newProductName;
        let departmentName = answers.departmentName;
        let price = answers.price;
        let stockQuantity = answers.stockQuantity;

        console.log(newProductName);
        console.log(departmentName);
        console.log(price);
        console.log(stockQuantity);

        connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",
            [newProductName, departmentName, price, stockQuantity],
            function (err, res, fields) {
                if (err) throw err;
            }
        );

        console.log("Product Successfully Added");
        connection.end();



    });
};
