function getColumnNames(app, client) {
    app.get('/get-column-names', (req, res) => {
        const table_name = req.query.table
        const query =
            `SELECT column_name, ordinal_position
             FROM information_schema.columns
             WHERE table_name = '${table_name}'
             ORDER BY ordinal_position;`
        client.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving column names');
            } else {
                const rows = result.rows
                const columnNames = rows.map((row) => row.column_name);
                res.send(columnNames)
            }
        })
    })

}

module.exports = {getColumnNames}