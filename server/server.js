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
