const path = require('path')
const express = require('express')
const query = require('./queries.js')
const app = express()
const bodyParser = require('body-parser')

const staticFilesPath = path.join(__dirname, '../public')

app.use(express.static(staticFilesPath))
app.use(bodyParser.json())
// app.use(express.json())

app.get('/all-nuggets', function (req, res) {
  query.getAll((err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).send('error getting data from database')
    }
    res.json(result.rows)
  })
})
app.post('/add-nugget', function (req, res) {
  // get the data from the request
  console.log('received request');
  const data = req.body
  // add to the database
  query.addNugget(data, (err) => {
    if (err) {
      return res.send('error adding nugget')
    }
    // send back a response message
    res.send('nugget added successfully')
  })
})

module.exports = app
