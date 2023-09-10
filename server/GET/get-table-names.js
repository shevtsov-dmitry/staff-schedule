function getTableNames(app, client){
    app.get('/get-table-names', (req, res) => {
        try {
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
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

module.exports = { getTableNames }