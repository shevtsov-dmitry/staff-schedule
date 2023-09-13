function findEmployeeIdByName(app, client) {
        app.get('/find-employee-id-by-name', (req, res) => {
        const first_name = req.query.first_name
        const last_name = req.query.last_name
        const QUERY = `SELECT employee_id
                       FROM employee
                       WHERE first_name = '${first_name}'
                         AND last_name = '${last_name}'`

        client.query(QUERY, (err, result) => {
            res.send(result.rows)
        })
    })
}

module.exports = {findEmployeeIdByName}