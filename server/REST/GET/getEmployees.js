function getEmployees(app, client) {
    app.get('/get-employees', (req, res) => {
        const query = "SELECT first_name, last_name FROM employee"
        client.query(query, (err, result) => {
            if (err) {
                res.status(500).send('Error retrieving employees');
            }
            let employees = []
            for (let key in result.rows) {
                employees.push(result.rows[key])
            }
            res.send(employees)
        });

    })
}

module.exports = {getEmployees}