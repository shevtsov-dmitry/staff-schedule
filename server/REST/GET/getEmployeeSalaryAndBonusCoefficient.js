function getEmployeeSalaryAndBonusCoefficient(app, client) {
    app.get('/get-employee-salary-and-bonus-coefficient', (req, res) => {
        const employee_id = req.query.id
        const QUERY = `SELECT salary,bonus_coefficient FROM salary_record WHERE employee_id = ${employee_id};`
        client.query(QUERY, (err, result) => {
            res.send(result.rows)
        })
    })
}

module.exports = {getEmployeeSalaryAndBonusCoefficient}