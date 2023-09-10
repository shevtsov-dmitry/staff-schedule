function addEmptyRow(app, client) {

    app.post('/add-empty-row', (req, res) => {
        const table_name = req.query.table
        client.query(`INSERT INTO ${table_name} DEFAULT
                      VALUES`)
    })
}

module.exports = {addEmptyRow}
