const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const {Client} = require('pg')

const {addEmptyRow} = require("./REST/POST/addEmptyRow");
const {assignEmployeeToShift} = require("./REST/POST/assignEmployeeToShift");
const {changeEmployeeSalary} = require("./REST/POST/changeEmployeeSalary");
const {deleteSelectedRows} = require("./REST/POST/deleteSelectedRows");
const {saveTable} = require("./REST/POST/saveTable");
const {sendEmail} = require("./REST/POST/sendEmail");
const {updateEmployeeSalaryWithStoredProcedure} = require("./REST/POST/updateEmployeeSalaryWithStoredProcedure");
const {verifyAdmin} = require("./REST/POST/verifyAdmin");

const {findEmployeeIdByName} = require("./REST/GET/findEmployeeIdByName");
const {getAllDataFromTable} = require("./REST/GET/getAllDataFromTable");
const {getAvailableEmployees} = require("./REST/GET/getAvailableEmployees");
const {getColumnNames} = require("./REST/GET/getColumnNames");
const {getDepartmentNames} = require("./REST/GET/getDepartmentNames");
const {getEmployeeNamesAndTheirShifts} = require("./REST/GET/getEmployeeNamesAndTheirShifts");
const {getEmployeeSalaryAndBonusCoefficient} = require("./REST/GET/getEmployeeSalaryAndBonusCoefficient");
const {getEmployees} = require("./REST/GET/getEmployees");
const {getMailStorage} = require("./REST/GET/getMailStorage");
const {getReportFromEmail} = require("./REST/GET/getReportFromEmail");
const {getShiftsTime} = require("./REST/GET/getShiftsTime");
const {getTableNames} = require("./REST/GET/getTableNames");

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