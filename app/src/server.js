const path = require('path')
const express = require('express')
const query = require('./queries.js')
const app = express()

const staticFilesPath = path.join(__dirname, '../public')
app.use(express.static(staticFilesPath))

app.get('/all-nuggets', function (req, res) {
  query.getAll((err, result) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('result is ', JSON.stringify(result.rows))
  })
})

app.listen(4000, function () {
  console.log('The magic happens on port 4000!')
})
