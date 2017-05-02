const path = require('path')
const express = require('express')
const app = express()

const staticFilesPath = path.join(__dirname, '../public')
app.use(express.static(staticFilesPath))

module.exports = app
