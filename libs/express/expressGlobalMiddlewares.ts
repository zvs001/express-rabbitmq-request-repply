import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import addRequestId from 'express-request-id'
import requestLoggerMiddleware from '../expressRequestLogger'

const isTest = process.env.NODE_ENV === 'test'

const app = express.Router()

app.use(cors('*'))
app.use(addRequestId())

/**
 * remove after release
 */
app.use('/doc', express.static('doc'))
app.use('/tests', express.static('mochawesome-report'))

/**
 * Upload dir with files and images
 */
// app.use('/assets', express.static('assets'))

/**
 * Set up headers
 */
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use(bodyParser.urlencoded({
  extended: true,
}))

app.use(bodyParser.json())

!isTest && app.use(requestLoggerMiddleware())

export default app
