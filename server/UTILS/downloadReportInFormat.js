const {toXML} = require("jstoxml");
const {Parser} = require("@json2csv/plainjs");

// constructors
function Employee(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
}

function Shift(shiftStartTime, shiftEndTime) {
    this.shiftStartTime = shiftStartTime
    this.shiftEndTime = shiftEndTime
}

function EmployeeShift(shiftStartTime, shiftEndTime, assignedEmployeeList) {
    this.shiftStartTime = shiftStartTime;
    this.shiftEndTime = shiftEndTime;
    this.assignedEmployeeList = assignedEmployeeList;
}

// main function
function downloadReportInFormat(app, client) {
    app.get("/download-report-in-format", (req, res) => {
        const format = req.query.format
        client.query(QUERY, (err, result) => {
            const JSONReport = composeJSONReport(result)
            const report = parseReportToRequestedFormat(JSONReport, format)
            sendReportFileAsResponse(report, format, res);
        })
    })
}
module.exports = {downloadReportInFormat}

// mutual query
const QUERY = `SELECT *
               FROM show_employees_shifts
               WHERE shift_start_time = '09:00:00'
                 AND shift_end_time = '18:00:00'`;

function sendReportFileAsResponse(report, format, res) {
    if(format === "Unsupported format."){
        res.sendStatus(400).body("Unsupported format.")
    }
    res.setHeader('Content-Type', `text/${format}`);
    res.setHeader('Content-Disposition', `attachment; filename="${format}"`);
    res.send(report)
}

function parseTextReport(answerObject) {
    let textData = ""
    for (let name of answerObject.assigned_employee_list) {
        textData += `${answerObject.shift_start_time}|${answerObject.shift_end_time}|${name}\n`
    }
    return textData.substring(0, textData.length - 1) // get rid of last element \n
}

function parseReportToRequestedFormat(JSONReport, format) {
    if (format === "json")
        return JSONReport
    if (format === "xml")
        return `<?xml version="1.0" encoding="UTF-8" ?><root>${toXML(JSONReport)}</root>`
    if (format === "txt")
        return parseTextReport(JSONReport);
    if (format === "csv") {
        const opts = {};
        const parser = new Parser(opts);
        return parser.parse(JSONReport);
    }
    return "Unsupported format.";
}

function composeJSONReport(result) {
    const employeesNames = []
    for (let el of result.rows) {
        const employeeName = `${el.first_name} ${el.last_name}`
        employeesNames.push(employeeName)
    }
    const shift = new Shift(result.rows[0].shift_start_time, result.rows[0].shift_end_time)
    const employeeShift = new EmployeeShift(shift.shiftStartTime, shift.shiftEndTime, employeesNames)
    return {
        shift_start_time: employeeShift.shiftStartTime,
        shift_end_time: employeeShift.shiftEndTime,
        assigned_employee_list: employeeShift.assignedEmployeeList
    }
}

