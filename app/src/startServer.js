const app = require('../src/server.js')
const port = process.env.port || 8111

app.listen(port, function () {
  console.log(`The magic happens on port ${port}!`)
})
