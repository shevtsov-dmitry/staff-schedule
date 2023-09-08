const {Client} = require('pg')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const {query} = require("express");

const app = express();
// access between web and server
const access_url = "http://localhost:5173/"

// app.use(cors({
//     origin: access_url
// }));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", access_url);
//     // res.header("Access-Control-Allow-Origin", access_url + "$/index.html");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors({
    origin: '*'
}));


// * ------ CLIENT CONNECT TO DB ------
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'staff_schedule',
    password: '123123',
    port: 5432,
});

client.connect()

// *** ------ GETS ------
// GET * table names from database
app.get('/get-table-names', (req, res) => {
    try {
        const query = `SELECT table_name
                       FROM information_schema.tables
                       WHERE table_schema = 'public'
                         AND table_catalog = '${client.database}'
                         AND table_type = 'BASE TABLE';`;

        client.query(query, (err, result) => {
            if (err) {
                throw err;
            }
            res.send(result.rows);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// GET * column names from table
app.get('/get-column-names', (req, res) => {
    const table_name = req.query.table
    const query =
        `SELECT column_name, ordinal_position
         FROM information_schema.columns
         WHERE table_name = '${table_name}'
         ORDER BY ordinal_position;`
    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving column names');
        } else {
            const rows = result.rows
            const columnNames = rows.map((row) => row.column_name);
            res.send(columnNames)
        }
    })
})
// GET * rows
app.get('/get-all-data-from-table', (req, res) => {
    const table_name = req.query.table
    const query = `SELECT *
                   FROM ${table_name}`
    client.query(query, (err, result) => {
        const rows = result.rows
        res.send(rows)
    })
})

// *** ------ POSTS ------
// add row
app.post('/add-empty-row', (req, res) => {
    const table_name = req.query.table
    client.query(`INSERT INTO ${table_name} DEFAULT
                  VALUES`)
})

app.use(bodyParser.json())
app.post('/delete-selected-rows', (req, res) => {
    const receivedArray = req.body
    const start = receivedArray[0]
    const end = receivedArray[1]
    // TODO const table_name = receivedArray[3]
    const query = `DELETE
                   FROM department
                   WHERE department_id BETWEEN ${start} AND ${end}`
    client.query(query)
})

// app.post('/save-table', (req, res) => {
//     const { tableName, table } = req.body;
//     console.log(tableName, table);
//
//     //  database library Sequelize
//     const Model = require(`/models/${tableName}`);
//
//     // Fetch the existing table from the database
//     Model.findOne({ where: { tableName } })
//       .then(existingTable => {
//         if (existingTable) {
//           // Compare the modified table with the existing one
//           const isModified = compareTables(existingTable, table);
//
//           if (isModified) {
//             // Update the table in the database
//             existingTable.update(table)
//               .then(() => {
//                 console.log('Table updated successfully');
//                 res.status(200).json({ message: 'Table updated successfully' });
//               })
//               .catch(error => {
//                 console.error('Error updating table:', error);
//                 res.status(500).json({ error: 'Failed to update table' });
//               });
//           } else {
//             console.log('No changes in the table');
//             res.status(200).json({ message: 'No changes in the table' });
//           }
//         } else {
//           console.log('Table not found');
//           res.status(404).json({ error: 'Table not found' });
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching existing table:', error);
//         res.status(500).json({ error: 'Failed to fetch existing table' });
//       });
//   });

app.post('/save-table', (req, res) => {
    const requestData = req.body
    const table_name = requestData.pop()[0]
    // console.log("request data");
    // console.log(requestData);
    const query = `SELECT *
                   FROM ${table_name}`
    client.query(query, (err, result) => {
        const databaseData = result.rows

        let valuesToChange = []

        for (let i = 0; i < databaseData.length; i++) {
            const requestArrayData = requestData[i]
            const databaseObjectData = databaseData[i]

            let tempLoopValuesOfObject = []
            for (const databaseObjectDataKey in databaseObjectData) {
                let objVal = databaseObjectData[databaseObjectDataKey];
                tempLoopValuesOfObject.push(objVal)
            }


            let shouldPush = false;
            for (let j = 0; j < requestArrayData.length; j++) {
                if (requestArrayData[j] !== tempLoopValuesOfObject[j]) shouldPush = true
            }

            if (shouldPush === true)
                valuesToChange.push(requestArrayData)

        }

        // console.log(valuesToChange);

        // const values = [['new', 'values'], 30]; // $1 is replaced with ['new', 'values'], $2 is replaced with 30
        // const query = 'UPDATE $1 SET data_array = $2 WHERE id = $3';

        for (const array of valuesToChange) {

            let composedQuery = ""

            const id = array[0]

            const qr =
                `SELECT column_name, ordinal_position
                 FROM information_schema.columns
                 WHERE table_name = '${table_name}'
                 ORDER BY ordinal_position;`

            client.query(qr, (err, result) => {
                const rows = result.rows
                const columnNames = rows.map((row) => row.column_name);

                composedQuery = `UPDATE ${table_name}
                                 SET `

                for (let i = 0; i < columnNames.length; i++) {
                    const columnName = columnNames[i];
                    let value = array[i];
                    if (typeof value === "string") value = `'${value}'`
                    composedQuery += `${columnName} = ${value},`
                }

                composedQuery = composedQuery.substring(0, composedQuery.length - 1)
                composedQuery += ` WHERE ${columnNames[0]} = ${id}`

                console.log(composedQuery)
                client.query(composedQuery)
            })

        }


    })
    res.sendStatus(200)

})

app.post(`/admin`, (req, res) => {

    // let login = req.body.login
    // let password = req.body.password
    // const query = `SELECT id
    //                FROM admins
    //                WHERE login = ${login}
    //                 AND password = ${password}`
    // client.query(query, (err, result) => {
    //     console.log(result);
    // console.log(result.rows[0].id);
    // if (result.rows[0].id === undefined) res.send(true)
    // else res.send(false)
    // })
    let r = req.body
    res.send(true)

})

app.get('/get-employees', (req, res) => {
    const query = "SELECT first_name, last_name FROM employee"
    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving employees');
        } else {
            // const rows = result.rows
            let array = []
            for (let rowsKey in result.rows) {
                array.push(result.rows[rowsKey])
            }
            res.send(array)
        }
    });

})

app.get('/get-department-names', (req, res) => {
    const query = "SELECT department_name FROM department;"
    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving department names');
        } else {
            // const rows = result.rows
            let array = []
            for (let rowsKey in result.rows) {
                array.push(result.rows[rowsKey])
            }
            res.send(array)
        }
    })
})

app.get('/get-available-employees', (req, res) => {
    const query = "SELECT first_name, last_name FROM employee WHERE department_id IS NULL "
    client.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving department names');
        } else {
            // const rows = result.rows
            let array = []
            for (let rowsKey in result.rows) {
                array.push(result.rows[rowsKey])
            }
            res.send(array)
        }
    })
})

app.get('/get-shifts-time', (req, res) => {
    const queryToSelectAvailableShifts = `
        SELECT shift_start_time, shift_end_time
        FROM shift_schedule
    `

    client.query(queryToSelectAvailableShifts, (err, result) => {
        if (err) {
            console.error(err);
            result.status(500).send('Error retrieving department names');
        } else {
            // const rows = result.rows
            let array = []
            for (let rowsKey in result.rows) {
                array.push(result.rows[rowsKey])
            }
            res.send(array)
        }
    })
})
app.post('/assign_employee_to_shift', (req, res) => {
    let first_name, last_name, shift_start_time, shift_end_time
    const elements = req.body

    let values = []
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
                    `
                    client.query(callProcedureQuery, (err, re) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send("Error retrieving changing employee's shift");
                        } else {
                            res.status(200).send({
                                    answer: ` Теперь на смене с номером ${selected_shift_schedule_id}` +
                                        ` работает сотрудник с идентификатором ${selected_employee_id}`
                                }
                            )
                        }
                    })
                }
            })
        }
    })



})


// * ------ RUN APP ------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});