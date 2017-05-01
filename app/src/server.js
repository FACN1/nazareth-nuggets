const path = require('path')
const express = require('express')
const app = express()

const staticFilesPath = path.join(__dirname, '../public')
app.use(express.static(staticFilesPath))

// app.get('/', function(req,res){
//   res.send('MARIOOOOOOOO pshu pshu pshu')
// })

app.listen(4000, function () {
  console.log('The magic happens on port 4000!')
})
