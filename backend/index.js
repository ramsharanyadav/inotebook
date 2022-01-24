const connectToMongo = require('./db');
var express = require('express');

connectToMongo();
const app = express()
const port = 5000

app.use(express.json())

// Default Routers

// app.get('/', (req, res) => {
//   res.send('Hello Ramsharan!')
// })

// Available Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
})