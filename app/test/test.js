const tape = require('tape')
const request = require('supertest')
const app = require('../src/server.js')

tape('home route test', t => {
  request(app)
    .get('/')
    .end(function (req, res) {
      t.ok(res.text.includes('<title>Nazareth Nuggets</title>'), 'request to / route should return html page containing correct title')
      t.end()
    })
})
