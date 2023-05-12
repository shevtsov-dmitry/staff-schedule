const { Client } = require('pg');
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

// GET * rows
app.get('/api/data', (req,res) => {
    client.query("SELECT * FROM department", (err, result)=>{
        const rows = result.rows
        res.send(rows)
        
    })
})

// SAVE
app.post('/saveData', (req, res) => {
    const data = req.body;
    data.forEach(row => {
      const query = `UPDATE department SET deparment_name = '${row[1]}', deparment_manager = '${row[2]}' WHERE id = ${row[0]}`;
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
    // res.sendStatus(200);
});

// add rows
app.post('/add-empty-row',(req,res)=>{
    client.query("INSERT INTO department DEFAULT VALUES")
})

// * RUN APP
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
