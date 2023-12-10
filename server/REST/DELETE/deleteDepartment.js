function deleteDepartment(app, client) {
    app.delete('/delete-dep', (req, res) => {
        const id = req.query.id;
        const query = `call sp_DeleteDepartment(${id})`;

        client.query(query, (err, result) => {
            if (err) {
                // Handle the error here
                console.error('Error:', err);
                res.status(500).json({ error: 'An error occurred while deleting the department' });
            } else {
                // Check the result or any other conditions
                if (result.rows.length === 0) {
                    res.status(400).json({ message: 'Cannot perform the action' });
                } else {
                    // Successful operation
                    res.send(result.rows).status(200).json({ message: 'Department deleted successfully' });
                }
            }
        });
    });
}

module.exports(deleteDepartment)