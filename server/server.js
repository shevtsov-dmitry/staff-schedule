const {Client} = require('pg')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const {query} = require("express");
const {getTableNames} = require("./GET/get-table-names");
const {getColumnNames} = require("./GET/getColumnNames");
const {getAllDataFromTable} = require("./GET/getAllDataFromTable");
const {addEmptyRow} = require("./POST/addEmptyRow");
const {deleteSelectedRows} = require("./POST/deleteSelectedRows");
const {saveTable} = require("./POST/saveTable");
const {deleteDepartment} = require("./POST/deleteDepartment")
const {verifyAdmin} = require("./POST/verifyAdmin");
const {getEmployees} = require("./GET/get-employees");
const {getDepartmentNames} = require("./GET/getDepartmentNames");
const {getAvailableEmployees} = require("./GET/getAvailableEmployees");
const {getShiftsTime} = require("./GET/getShiftsTime");
const {assignEmployeeToShift} = require("./POST/assignEmployeeToShift");
const app = express();
// access between web and server
const access_url = "http://localhost:5173/"

// app.use(cors({
//     origin: access_url
// }));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", access_url);
//     // res.header("Access-Control-Allow-Origin", access_url + "$/index.html");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors({
    origin: '*'
}));


// * ------ CLIENT CONNECT TO DB ------
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'staff_schedule',
    password: '123123',
    port: 5432,
});

client.connect()
app.use(bodyParser.json())

// *** ------ GETs ------

getTableNames(app, client)
getColumnNames(app, client)
getAllDataFromTable(app, client)
getEmployees(app,client)
getDepartmentNames(app,client)
getAvailableEmployees(app,client)
getShiftsTime(app, client)


// *** ------ POSTs ------
addEmptyRow(app, client)
deleteSelectedRows(app, client)
saveTable(app, client)
deleteDepartment(app, client)
verifyAdmin(app, client)
assignEmployeeToShift(app, client)

// * ------ RUN APP ------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});