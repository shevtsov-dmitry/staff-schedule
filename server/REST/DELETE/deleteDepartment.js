function deleteDepartment(app, client) {
    app.delete('/delete-dep', (req, res) => {
        const id = req.query.id;
        const query = `call sp_DeleteDepartment(${id})`;

        client.query(query, (err, result) => {
            if (err) {
                res.status(500).body('An error occurred while deleting the department');
            }
            if (result.rows.length === 0) {
                res.status(400).json('Cannot perform the action');
            }
            res.send(result.rows).status(200).body('Department deleted successfully');
        });
    });
}

module.exports(deleteDepartment)