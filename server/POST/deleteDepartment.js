function deleteDepartment(app, client) {
    app.post('/delete-dep', (req, res) => {
        const id = req.body.id
        const query = `call sp_DeleteDepartment(${id})`
        client.query(query, (err, result) => {
            res.status(200)
        })
    })
}

module.exports(deleteDepartment)