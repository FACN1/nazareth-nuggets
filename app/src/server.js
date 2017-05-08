const path = require('path')
const express = require('express')
const query = require('./queries.js')
const app = express()
const bodyParser = require('body-parser')
const aws = require('aws-sdk')

const staticFilesPath = path.join(__dirname, '../public')

app.use(express.static(staticFilesPath))
app.use(bodyParser.json())
// app.use(express.json())

app.get('/all-nuggets', function (req, res) {
  query.getAll((err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).send('error getting data from database')
    }
    res.json(result.rows)
  })
})
app.post('/add-nugget', function (req, res) {
  // get the data from the request
  const data = req.body
  // add to the database
  query.addNugget(data, (err) => {
    if (err) {
      return res.send('error adding nugget')
    }
    // send back a response message
    res.send('nugget added successfully')
  })
})

const S3_BUCKET = process.env.S3_BUCKET

app.get('/sign-s3', function (req, res) {
  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'eu-west-2'
  })
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, function (err, data) {
    if (err) {
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedRequest: data,
      url: `http://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    }
    res.write(JSON.stringify(returnData))
    res.end()
  })
})

module.exports = app
