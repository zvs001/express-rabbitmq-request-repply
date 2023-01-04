import express from 'express'
import objectHash from 'object-hash'
import cacheController from '@controllers/cacheController'
import userApiController from '@controllers/userApiController'
import { User } from '@models/UserModel'
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
  const cacheResult = await cacheController.getCache(key)
  if (cacheResult?.exists) {
    console.log('return cached data')
    // here we handle only successful requests, but potentially we can handle errors too...
    return res.send(cacheResult.value)
  }

  const result = await userApiController.getList(queryData)

  res.send(result)

  // we don't need to wait for reply here. Added just to save time
  await cacheController.saveCache({ key, value: result })
})

export default app
