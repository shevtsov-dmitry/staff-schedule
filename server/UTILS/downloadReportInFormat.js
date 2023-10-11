const { toXML } = require("jstoxml");
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

// mutual query
// TODO hardcoded shift time values. Better to change as incoming params
const QUERY = `SELECT *
                       FROM show_employees_shifts
                       WHERE shift_start_time = '09:00:00'
                         AND shift_end_time = '18:00:00'`;

function downloadReportInFormat(app, client) {
    app.get("/download-report-in-format", (req, res) => {
        const format = req.query.format
        //create JSON object

        client.query(QUERY, (err, result) => {

            const employeesNames = []
            for (let el of result.rows) {
                const employeeName = `${el.first_name} ${el.last_name}`
                // console.log("NAME: " + employeeName)
                employeesNames.push(employeeName)
            }
            const shift = new Shift(result.rows[0].shift_start_time, result.rows[0].shift_end_time)
            const employeeShift = new EmployeeShift(shift.shiftStartTime, shift.shiftEndTime, employeesNames)
            const answerObject = {
                shift_start_time: employeeShift.shiftStartTime,
                shift_end_time: employeeShift.shiftEndTime,
                assigned_employee_list: employeeShift.assignedEmployeeList
            }

            switch (format) {
                case "json": {
                    res.setHeader('Content-Type', 'text/json');
                    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
                    res.send(answerObject)
                    break
                }
                case "xml": {
                    res.setHeader('Content-Type', 'text/xml');
                    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
                    const XML = `<?xml version="1.0" encoding="UTF-8" ?><root>${toXML(answerObject)}</root>`;
                    res.send(XML)
                    break
                }
                case "csv": {
                    const opts = {};
                    const parser = new Parser(opts);
                    const csv = parser.parse(answerObject);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
                    res.send(csv)
                    break
                }
                case "txt": {
                    // Convert the query result to an array of objects
                    const data = result.rows;
                    // Convert the data to a custom text format with "|" delimiters
                    let textData = ""
                    for (const el of data) {
                        textData += `${el.shift_start_time}|${el.shift_end_time}|${el.first_name} ${el.last_name}\n`
                    }
                    textData = textData.substring(0, textData.length-1) // get rid of last element \n
                        res.setHeader('Content-Type', 'text/plain');
                        res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
                        res.send(textData)
                    break
                }
            }


        })

    })
}

module.exports = {downloadReportInFormat}

