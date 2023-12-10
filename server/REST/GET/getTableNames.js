function getTableNames(app, client) {
    app.get('/get-table-names', (req, res) => {
        const query = `SELECT table_name
                       FROM information_schema.tables
                       WHERE table_schema = 'public'
                         AND table_catalog = '${client.database}'
                         AND table_type = 'BASE TABLE';`;

        client.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            res.send(result.rows);
        });
    });
}

module.exports = {getTableNames}