function getDepartmentNames(app, client){
    app.get('/get-department-names', (req, res) => {
        const query = "SELECT department_id, department_name FROM department;"
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

module.exports = {getDepartmentNames}