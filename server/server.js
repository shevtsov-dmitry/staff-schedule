const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const {Client} = require('pg')

const {addEmptyRow} = require("./POST/addEmptyRow");
const {assignEmployeeToShift} = require("./POST/assignEmployeeToShift");
const {changeEmployeeSalary} = require("./POST/changeEmployeeSalary");
const {deleteSelectedRows} = require("./POST/deleteSelectedRows");
const {saveTable} = require("./POST/saveTable");
const {sendEmail} = require("./POST/sendEmail");
const {updateEmployeeSalaryWithStoredProcedure} = require("./POST/updateEmployeeSalaryWithStoredProcedure");
const {verifyAdmin} = require("./POST/verifyAdmin");

const {findEmployeeIdByName} = require("./GET/findEmployeeIdByName");
const {getAllDataFromTable} = require("./GET/getAllDataFromTable");
const {getAvailableEmployees} = require("./GET/getAvailableEmployees");
const {getColumnNames} = require("./GET/getColumnNames");
const {getDepartmentNames} = require("./GET/getDepartmentNames");
const {getEmployeeNamesAndTheirShifts} = require("./GET/getEmployeeNamesAndTheirShifts");
const {getEmployeeSalaryAndBonusCoefficient} = require("./GET/getEmployeeSalaryAndBonusCoefficient");
const {getEmployees} = require("./GET/getEmployees");
const {getMailStorage} = require("./GET/getMailStorage");
const {getReportFromEmail} = require("./GET/getReportFromEmail");
const {getShiftsTime} = require("./GET/getShiftsTime");
const {getTableNames} = require("./GET/getTableNames");

const {downloadReportInFormat} = require("./UTILS/downloadReportInFormat");

const DATABASE_CONNECTION_CREDENTIALS = require("./configurations/DATABASE_CONNECTION_CREDENTIALS");

const app = express();

// * ------ CORS POLICY ------
app.use(cors({
    origin: '*'
}));

// * ------ CLIENT CONNECT TO DB ------
const client = new Client(DATABASE_CONNECTION_CREDENTIALS);
client.connect()

// *
app.use(bodyParser.json())

// *** ------ GETs ------
getTableNames(app, client)
getColumnNames(app, client)
getAllDataFromTable(app, client)
getEmployees(app, client)
getDepartmentNames(app, client)
getAvailableEmployees(app, client)
getShiftsTime(app, client)
getEmployeeSalaryAndBonusCoefficient(app, client)
findEmployeeIdByName(app, client)
getEmployeeNamesAndTheirShifts(app, client)
getMailStorage(app)

// *** ------ POSTs ------
addEmptyRow(app, client)
deleteSelectedRows(app, client)
saveTable(app, client)
verifyAdmin(app, client)
assignEmployeeToShift(app, client)
changeEmployeeSalary(app, client)
updateEmployeeSalaryWithStoredProcedure(app, client)

// *** DOWNLOADS
downloadReportInFormat(app, client)

// *** Email operations
sendEmail(app)
getReportFromEmail(app)


// * ------ RUN APP ------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});