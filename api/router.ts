import express from 'express'
import usersRouter from './users/router'

const app = express.Router()

app.use('/users', usersRouter)

export default app
