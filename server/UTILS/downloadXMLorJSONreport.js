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


function downloadXMLorJSONreport(app, client) {
    app.get("/download-report-in-format", (req, res) => {
        const format = req.query.format
        //create JSON object
        const QUERY = `SELECT *
                       FROM show_employees_shifts
                       WHERE shift_start_time = '09:00:00'
                         AND shift_end_time = '18:00:00'`;
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
                    res.send(answerObject)
                    break
                }
                case "xml": {

                    break
                }
            }


        })


    })
}

module.exports = {downloadXMLorJSONreport}

