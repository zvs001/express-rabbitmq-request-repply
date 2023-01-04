import express from 'express'
import objectHash from 'object-hash'
import { User } from '@models/UserModel'
import amqpClient from '@libs/amqpClient'
import cacheServiceActions, { QUEUE as CACHE_QUEUE } from '../../src/const/cacheServiceActions'
import userServiceActions from '../../src/const/userServiceActions'

const app = express.Router()

type RouteResponse = User | null
type RouteQuery = {
  page?: number
  limit?: number
  country?: string
  city?: string
}

app.get<{}, RouteResponse, {}, RouteQuery, {}>('/', async (req, res) => {
  let {
    page = 1, limit = 100, country, city,
  } = req.query

  // it might be handled inside users service, but here is important for proper hash handing
  let offset = page * limit - limit
  const queryData = {
    limit, offset, country, city,
  }

  const key = objectHash({
    action: userServiceActions.GET_LIST,
    params: queryData,
  })

  // not in middleware, because we need to format params
  const cacheResponse = await amqpClient.sendRPCMessage(CACHE_QUEUE, {
    action: cacheServiceActions.GET,
    params: {
      key,
    },
  })
  const cacheResult = cacheResponse?.result
  if (cacheResult?.exists) {
    console.log('return cached data')
    // here we handle only successful requests, but potentially we can handle errors too...
    return res.send(cacheResult.value)
  }

  const response = await amqpClient.sendRPCMessage('USERS_SERVICE', {
    action: userServiceActions.GET_LIST,
    params: {
      ...queryData,
    },
  })

  const { result } = response || {}

  res.send(result)

  // we don't need to wait for reply here. Added just to save time
  await amqpClient.sendRPCMessage(CACHE_QUEUE, {
    action: cacheServiceActions.SET,
    params: {
      key,
      value: result,
    },
  })
})

export default app
