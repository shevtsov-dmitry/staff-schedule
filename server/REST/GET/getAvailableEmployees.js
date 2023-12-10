function getAvailableEmployees(app, client) {
    app.get('/get-available-employees', (req, res) => {
        const query = "SELECT first_name, last_name FROM employee WHERE department_id IS NULL "
        client.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving department names');
            } else {
                // const rows = result.rows
                let array = []
                for (let rowsKey in result.rows) {
                    array.push(result.rows[rowsKey])
                }
                res.send(array)
            }
        })
    })
}

module.exports = {getAvailableEmployees}