const dbConnection = require('../database/db_connection.js')

const getAll = (cb) => {
  dbConnection.query('SELECT * FROM nuggets', (error, result) => {
    if (error) {
      return cb(error)
    }
    return cb(null, result)
  })
}

module.exports = {
  getAll
}
