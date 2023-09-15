function updateEmployeeSalaryAndBonus(app, client) {
    app.post('/update-employee-salary-and-bonus', (req, res) => {
        const { employeeId, bonusCoefficient } = req.body;
        const query = `CALL calculateEmployeeBonus($1, $2)`;

        client.query(query, [employeeId, bonusCoefficient], (err, result) => {
            if (err) {
                // Обрабатываем возможную ошибку здесь
                console.error('Error:', err);
                res.status(500).json({ error: 'An error occurred while updating the salary and bonus' });
            } else {
                // Проверка результата
                if (result.rowCount === 0) {
                    res.status(400).json({ message: 'Cannot perform the action' });
                } else {
                    // Successful operation
                    res.status(200).json({ message: 'Salary and bonus updated successfully' });
                }
            }
        });
    });
}

module.exports = {updateEmployeeSalaryAndBonus}