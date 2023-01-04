import express from 'express'
import expressGlobalMiddleWares from './expressGlobalMiddlewares'

const app = express()

app.set('trust proxy', 1) // it changes proxy x-forwarded-for ip as client ip
app.use(expressGlobalMiddleWares)

export default app
