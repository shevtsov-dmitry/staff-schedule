function saveTable(app, client) {
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
}

module.exports = {saveTable}
