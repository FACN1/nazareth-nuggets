const tape = require('tape')
const request = require('supertest')
const app = require('../src/server.js')

tape('home route test', t => {
  request(app)
    .get('/')
    .end(function (req, res) {
      t.ok(res.text.includes('<link rel="stylesheet" href="./css/main.css">'), 'test string is served up')
      t.end()
    })
})
