const tape = require('tape')
const request = require('supertest')
const app = require('../src/server.js')

tape('basic passing test, to check tape is functioning correctly', t => {
  t.ok(true, 'meaningless test should pass')
  t.end()
})

tape('home route test', t => {
  request(app)
    .get('/')
    .end(function (req, res) {
      // console.log(res)
      t.ok(res.text.includes('<link rel="stylesheet" href="./main.css">'), 'test string is served up')
      t.end()
    })
})
