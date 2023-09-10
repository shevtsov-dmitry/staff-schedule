function getEmployees(app, client){
    app.get('/get-employees', (req, res) => {
        const query = "SELECT first_name, last_name FROM employee"
        client.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving employees');
            } else {
                // const rows = result.rows
                let array = []
                for (let rowsKey in result.rows) {
                    array.push(result.rows[rowsKey])
                }
                res.send(array)
            }
        });

    })
}

module.exports = {getEmployees}