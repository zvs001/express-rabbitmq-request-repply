import express from 'express'
import usersGet from './@.get'
import getById from './id.get'

const app = express.Router()

app.use([
  usersGet,
  getById,
])

export default app
