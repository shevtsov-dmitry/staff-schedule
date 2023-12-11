function changeEmployeeSalary(app, client) {
    app.post('/change-employee-salary', (req, res) => {
        const new_salary = req.query.new_salary
        const employee_id = req.query.employee_id
        const QUERY = `UPDATE salary_record
                              SET salary = ${new_salary}
                              WHERE employee_id = ${employee_id}`;

        client.query(QUERY, (err, result) => {
            res.send('OK')
        })
    })
}

module.exports = {changeEmployeeSalary}