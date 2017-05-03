const app = require('./server.js')

const port = process.env.PORT || 8111

app.listen(port, function () {
  console.log(`The magic happens on port ${port}!`)
})
