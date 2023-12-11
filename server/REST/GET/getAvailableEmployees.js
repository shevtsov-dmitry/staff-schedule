function getAvailableEmployees(app, client) {
    app.get('/get-available-employees', (req, res) => {
        const query = "SELECT first_name, last_name FROM employee WHERE department_id IS NULL"
        client.query(query, (err, result) => {
            if (err){
                res.status(500).send('Error retrieving department names');
            }
            let availableEmployees = []
            for (let key in result.rows) {
                availableEmployees.push(result.rows[key])
            }
            res.send(availableEmployees)
        })
    })
}

module.exports = {getAvailableEmployees}