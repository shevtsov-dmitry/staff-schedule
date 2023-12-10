function getShiftsTime(app, client) {
    app.get('/get-shifts-time', (req, res) => {
        const queryToSelectAvailableShifts = `SELECT shift_start_time, shift_end_time FROM shift_schedule`;
        client.query(queryToSelectAvailableShifts, (err, result) => {
            if (err) {
                result.status(500).send('Error retrieving department names');
            }
            let shiftsTime = []
            for (let rowsKey in result.rows) {
                shiftsTime.push(result.rows[rowsKey])
            }
            res.send(shiftsTime)
        })

    })
}

module.exports = {getShiftsTime}