const fs = require('fs')
const path = require('path')

const dbConnection = require('./db_connection.js')

fs.readFile(path.join(__dirname, './db_build.sql'), (err, file) => {
  if (err) throw err
  dbConnection.query(file.toString(), (dbError, res) => {
    if (dbError) throw dbError
    console.log('Database created with the result: ', res)
    process.exit()
  })
})
