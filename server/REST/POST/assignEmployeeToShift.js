function assignEmployeeToShift(app, client) {
    app.post('/assign_employee_to_shift', (req, res) => {
        let first_name, last_name, shift_start_time, shift_end_time
        const elements = req.body

        for (let elementsKey in elements) {
            elements.push(elements[elementsKey])
        }
        first_name = elements[0]
        last_name = elements[1]
        shift_start_time = elements[2]
        shift_end_time = elements[3]

        const queryToSelectEmployeeId = `
            SELECT employee_id
            FROM employee
            WHERE first_name = '${first_name}'
              AND last_name = '${last_name}';
        `;

        const queryToSelectShiftId = `
            SELECT shift_schedule_id
            FROM shift_schedule
            WHERE shift_start_time = '${shift_start_time}'
              AND shift_end_time = '${shift_end_time}'
        `;

        client.query(queryToSelectEmployeeId, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving changing employee's shift");
            } else {
                // const rows = result.rows
                const selected_employee_id = result.rows[0].employee_id
                console.log(selected_employee_id);

                client.query(queryToSelectShiftId, (err, reslt) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error retrieving changing employee's shift");
                    } else {
                        // const rows = result.rows
                        const selected_shift_schedule_id = reslt.rows[0].shift_schedule_id

                        const callProcedureQuery = `
                        CALL assign_employee_to_shift(${selected_shift_schedule_id},${selected_employee_id})
                    `;
                        client.query(callProcedureQuery, (err, re) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send("Error retrieving changing employee's shift");
                            } else {
                                res.status(200).send({
                                        answer: ` Теперь на смену с ${shift_start_time} до ${shift_end_time} ` +
                                            `назначен сотрудник ${first_name} ${last_name}.`
                                    }
                                )
                            }
                        })
                    }
                })
            }
        })


    })
}

module.exports = {assignEmployeeToShift}