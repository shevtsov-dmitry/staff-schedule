function deleteSelectedRows(app, client) {
    app.post('/delete-selected-rows', (req, res) => {
        const receivedArray = req.body
        const start = receivedArray[0]
        const end = receivedArray[1]
        const query = `DELETE
                       FROM department
                       WHERE department_id BETWEEN ${start} AND ${end}`
        client.query(query)
    })
}

module.exports = {deleteSelectedRows}
