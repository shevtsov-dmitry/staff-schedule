function  getEmployeeNamesAndTheirShifts(app, client){
    app.get('/get-employees-names-and-their-shifts', (req, res) => {
        // VIEW @param show_employees_shifts
        const QUERY = `SELECT * FROM show_employees_shifts WHERE shift_start_time='${req.query.time}'`;
        client.query(QUERY, (err, result) => {
            res.send(result.rows)
        })

    })
}

module.exports = {getEmployeeNamesAndTheirShifts}