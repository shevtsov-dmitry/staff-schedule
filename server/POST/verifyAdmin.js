function verifyAdmin(app, client) {
    app.post(`/verifyAdmin`, (req, res) => {
        console.log(req.body);
        let login = req.body.login
        let password = req.body.password
        const query = `
            SELECT id
            FROM admins
            WHERE login = ${login}
              AND password = ${password}`;
        client.query(query, (err, result) => {
            // if (result.rows[0].id === undefined) res.send(true)
            // else res.send(false)

            res.send(true)
        })

    })
}

module.exports = {verifyAdmin}