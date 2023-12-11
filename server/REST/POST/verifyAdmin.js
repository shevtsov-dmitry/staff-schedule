function verifyAdmin(app, client) {
    app.post(`/verify-admin`, (req, res) => {
        const data = req.body
        const login = data.login
        const password = data.password
        const query = `SELECT id FROM admins
                               WHERE login = '${login}' AND password = '${password}';`;

        client.query(query, (err, result) => {
            if(err){
                res.send("Couldn't verify attempt to login.")
            }
            const foundAnyMatch = result.rows.length !== 0
            res.send(foundAnyMatch)
        })
    })
}

module.exports = {verifyAdmin}