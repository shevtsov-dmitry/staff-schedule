function getAllDataFromTable(app, client){
    app.get('/get-all-data-from-table', (req, res) => {
        const table_name = req.query.table
        const query = `SELECT *
                   FROM ${table_name}`
        client.query(query, (err, result) => {
            const rows = result.rows
            res.send(rows)
        })
    })
}

module.exports = {getAllDataFromTable}