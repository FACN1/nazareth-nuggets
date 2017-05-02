const path = require('path')
const express = require('express')
const query = require('./queries.js')
const app = express()

const port = process.env.PORT || 8111

const staticFilesPath = path.join(__dirname, '../public')
app.use(express.static(staticFilesPath))

app.get('/all-nuggets', function (req, res) {
  query.getAll((err, result) => {
    if (err) {
      console.log(err)
      return res.send('DATABASE ERROR')
    }
    res.json(result.rows)
  })
})

app.listen(port, function () {
  console.log(`The magic happens on port ${port}!`)
})
