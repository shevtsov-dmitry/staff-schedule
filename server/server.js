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
// const {deleteDepartment} = require("./POST/deleteDepartment")
const {saveTable} = require("./POST/saveTable");
const {verifyAdmin} = require("./POST/verifyAdmin");
const {getEmployees} = require("./GET/get-employees");
const {getDepartmentNames} = require("./GET/getDepartmentNames");
const {getAvailableEmployees} = require("./GET/getAvailableEmployees");
const {getShiftsTime} = require("./GET/getShiftsTime");
const {assignEmployeeToShift} = require("./POST/assignEmployeeToShift");
const databaseConnectionCredentials = require("./configurations/database-connection-credentials");
const {getEmployeeSalaryAndBonusCoefficient} = require("./GET/get-employee-salary-and-bonus-coefficient");
const {findEmployeeIdByName} = require("./GET/findEmployeeIdByName");
const {changeEmployeeSalary} = require("./POST/changeEmployeeSalary");
const app = express();

// * ------ CORS POLICY ------
app.use(cors({
    origin: '*'
}));

// * ------ CLIENT CONNECT TO DB ------
const client = new Client(databaseConnectionCredentials);
client.connect()

// *
app.use(bodyParser.json())

// *** ------ GETs ------
getTableNames(app, client)
getColumnNames(app, client)
getAllDataFromTable(app, client)
getEmployees(app,client)
getDepartmentNames(app,client)
getAvailableEmployees(app,client)
getShiftsTime(app, client)
getEmployeeSalaryAndBonusCoefficient(app,client)
findEmployeeIdByName(app, client)


// *** ------ POSTs ------
addEmptyRow(app, client)
deleteSelectedRows(app, client)
saveTable(app, client)
// deleteDepartment(app, client)
verifyAdmin(app, client)
assignEmployeeToShift(app, client)
changeEmployeeSalary(app, client)

// * ------ RUN APP ------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});