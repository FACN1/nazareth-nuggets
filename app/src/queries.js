const dbConnection = require('../database/db_connection.js')

const getAll = (cb) => {
  dbConnection.query('SELECT * FROM nuggets', cb)
}

module.exports = {
  getAll
}
