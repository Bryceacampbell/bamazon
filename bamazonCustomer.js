
// Dependencies===================================================================

let mysql = require("mysql");
let inquirer = require("inquirer");

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

function displayProducts() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res, ["item_id", "product_name", "department_name", "price"]);
            start();

            // for (let i = 0; i < res.length; i++) {
            //     let itemId = res[i].item_id;
            //     let productName = res[i].product_name;
            //     let departmentName = res[i].department_name;
            //     let productPrice = res[i].price;
            //     let stockQuantity = res[i].stock_quantity;
            //     console.log(itemId + productName + departmentName + productPrice + "\n");
            // }

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

        var productSelection = answers.productSelection;
        let selectionQuantity = answers.selectionQuantity;

        connection.query(
            "SELECT item_id FROM products WHERE = ?",
            [parseInt(productSelection)],
            function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.log(res);
            }
        );
    });

};