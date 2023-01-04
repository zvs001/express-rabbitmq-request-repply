import express from 'express'
import request, { SuperTest, Test } from 'supertest'
import expressGlobalMiddlewares from '@libs/express/expressGlobalMiddlewares'
import router from '../router'

const server = express()
server.use(expressGlobalMiddlewares)
server.use(router)

const testServer: SuperTest<Test> = request(server)

export default testServer
