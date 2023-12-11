function updateEmployeeSalaryWithStoredProcedure(app, client){
    app.post('/update-salary', (req,res) => {
        const id = req.query.id
        const new_salary = req.query.new_salary
        const QUERY = `CALL sp_UpdateSalary(${id}, ${new_salary})`
        client.query(QUERY, (err, result) => {
            res.sendStatus(200)
        })
    })
}

module.exports = {updateEmployeeSalaryWithStoredProcedure}