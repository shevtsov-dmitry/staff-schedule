const { Client } = require('pg')
const bodyParser = require('body-parser')
const express = require('express')
const app = express();

// access between web and server
const cors = require('cors')
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update with your actual origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // * CLIENT CONNECT TO DB
const client = new Client({
    user: 'me',
    host: 'localhost',
    database: 'staff_schedule',
    password: '123123',
    port: 5432,
});

client.connect()

// *** GETS AND POSTS
// GET * table names from database
app.get('/get-table-names',(req,res)=>{
    const query = `SELECT table_name
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_catalog = '${client.database}'
    AND table_type = 'BASE TABLE';`
    client.query(query, (err,result)=>{
        res.send(result.rows)
    })
})

// GET * column names from table
app.get('/get-column-names', (req,res)=>{
    const query = `SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'department';`
    client.query(query, (err, result) =>{
        const rows = result.rows
        res.send(rows)
    })
})
// GET * rows
app.get('/api/data', (req,res) => {
    client.query("SELECT * FROM department", (err, result)=>{
        const rows = result.rows
        res.send(rows)
        
    })
})

// add row
app.post('/add-empty-row',(req,res)=>{
    client.query("INSERT INTO department DEFAULT VALUES")
})

app.use(bodyParser.json())
app.post('/delete-selected-rows', (req,res) =>{
    const recievedArray = req.body
    const start = recievedArray[0]
    const end = recievedArray[1]
    // TODO const table_name = recievedArray[3]
    const query = `DELETE FROM department WHERE department_id BETWEEN ${start} AND ${end}`
    client.query(query)

})

// * RUN APP
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
