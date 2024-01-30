// import Database connection function..............
const connectToMongo = require('./db');
// import express.js function..............
const express = require('express')

var cors = require('cors')
connectToMongo()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
// Using a Midware so we check json Data..............
app.use(express.json());

// Available Routes.........
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// Declearation App using port..............
app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`)
})
