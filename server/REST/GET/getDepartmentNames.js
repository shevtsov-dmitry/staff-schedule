function getDepartmentNames(app, client) {
    app.get('/get-department-names', (req, res) => {
        const query = "SELECT department_id, department_name FROM department;"
        client.query(query, (err, result) => {
            if (err) {
                res.status(500).send('Error retrieving department names');
            }
            let departmentNames = []
            for (let key in result.rows) {
                departmentNames.push(result.rows[key])
            }
            res.send(departmentNames)
        })
    })
}

module.exports = {getDepartmentNames}