async function handleRequest(req, response, client) {
    const first_name = req.query.first_name
    const last_name = req.query.last_name
    const shift_start_time = req.query.shift_start_time
    const shift_end_time = req.query.shift_end_time

    let selected_employee_id = await selectEmployeeId();
    let selected_shift_schedule_id = await selectShiftId();
    await assignEmployeeToNewShift();

    function selectShiftId() {
        return new Promise(resolve => {
            const query = `SELECT shift_schedule_id
                           FROM shift_schedule
                           WHERE shift_start_time = $1
                             AND shift_end_time = $2`;
            client.query(query, [shift_start_time, shift_end_time], (err, result) => {
                if (err) {
                    response.status(500).send("Error retrieving changing employee's shift");
                }
                resolve(result.rows[0].shift_schedule_id)
            })
        })
    }

    async function selectEmployeeId() {
        return new Promise(resolve => {
            const query = `SELECT employee_id
                           FROM employee
                           WHERE first_name = $1
                             AND last_name = $2;`;
            client.query(query, [first_name, last_name], (err, result) => {
                if (err) {
                    response.status(500).send("Error retrieving changing employee's shift");
                }
                resolve(result.rows[0].employee_id)
            })
        })
    }

    async function assignEmployeeToNewShift() {
        const callProcedureQuery = `CALL assign_employee_to_shift($1,$2)`;
        client.query(callProcedureQuery, [selected_shift_schedule_id, selected_employee_id], (err, result) => {
            if (err) {
                response.status(500).send("Error retrieving changing employee's shift");
            }
            response.status(200).send({
                answer: `Теперь на смену с ${shift_start_time} до ${shift_end_time} ` +
                    `назначен сотрудник ${first_name} ${last_name}.`
            })
            Promise.resolve()
        })
    }
}

function assignEmployeeToShift(app, client) {
    app.post('/assign_employee_to_shift', async (req, response) => await handleRequest(req, response, client))
}

module.exports = {assignEmployeeToShift}