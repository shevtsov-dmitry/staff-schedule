const { Client } = require('pg')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express();
// access between web and server
const access_url = "http://localhost:5173"
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", access_url); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// * ------ CLIENT CONNECT TO DB ------
const client = new Client({
    user: 'me',
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
        }
        else {
            const rows = result.rows
            const columnNames = rows.map((row) => row.column_name);
            res.send(columnNames)
        }
    })
})
// GET * rows
app.get('/get-all-data-from-table', (req, res) => {
    const table_name = req.query.table
    const query = `SELECT * FROM ${table_name}`
    client.query(query, (err, result) => {
        const rows = result.rows
        res.send(rows)
    })
})

// *** ------ POSTS ------
// add row
app.post('/add-empty-row', (req, res) => {
    const table_name = req.query.table
    client.query(`INSERT INTO ${table_name} DEFAULT VALUES`)
})

app.use(bodyParser.json())
app.post('/delete-selected-rows', (req, res) => {
    const recievedArray = req.body
    const start = recievedArray[0]
    const end = recievedArray[1]
    // TODO const table_name = recievedArray[3]
    const query = `DELETE FROM department WHERE department_id BETWEEN ${start} AND ${end}`
    client.query(query)
})

app.post('/save-table', (req, res) => {
    const { tableName, table } = req.body;
    console.log(tableName, table);
  
    //  database library Sequelize
    const Model = require(`/models/${tableName}`);
  
    // Fetch the existing table from the database
    Model.findOne({ where: { tableName } })
      .then(existingTable => {
        if (existingTable) {
          // Compare the modified table with the existing one
          const isModified = compareTables(existingTable, table);
  
          if (isModified) {
            // Update the table in the database
            existingTable.update(table)
              .then(() => {
                console.log('Table updated successfully');
                res.status(200).json({ message: 'Table updated successfully' });
              })
              .catch(error => {
                console.error('Error updating table:', error);
                res.status(500).json({ error: 'Failed to update table' });
              });
          } else {
            console.log('No changes in the table');
            res.status(200).json({ message: 'No changes in the table' });
          }
        } else {
          console.log('Table not found');
          res.status(404).json({ error: 'Table not found' });
        }
      })
      .catch(error => {
        console.error('Error fetching existing table:', error);
        res.status(500).json({ error: 'Failed to fetch existing table' });
      });
  });

// * ------ RUN APP ------
app.listen(3000, () => {
    console.log('Server started on port 3000');
});


