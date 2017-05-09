const dbConnection = require('../database/db_connection.js')

const getAll = (cb) => {
  dbConnection.query('SELECT * FROM nuggets', (error, result) => {
    if (error) {
      return cb(error)
    }
    return cb(null, result)
  })
}

const addNugget = (data, cb) => {
  dbConnection.query('INSERT INTO nuggets (lat, long, category, title, description, img_url, author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [data.lat, data.long, data.category, data.title, data.description, data.img_url, data.author], cb)
}
module.exports = {
  getAll,
  addNugget
}
