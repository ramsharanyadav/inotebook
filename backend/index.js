const connectToMongo = require('./db');
var express = require('express');

connectToMongo();
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello Ramsharan!')
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
})