function verifyAdmin(app, client) {
    app.post(`/verify-admin`, (req, res) => {
        const data = req.body
        const login = data.login
        const password = data.password
        const query = `
            SELECT id
            FROM admins
            WHERE login = '${login}'
              AND password = '${password}';`;

        client.query(query, (err, result) => {
            if(err) res.send(err)
            const foundIdObject = result.rows
            let countMatches = 0
            for (let foundIdObjectKey in foundIdObject) {
                countMatches++
            }
            if(countMatches === 0) res.send(false)
            else
                res.send(true)
        })
    })
}

module.exports = {verifyAdmin}