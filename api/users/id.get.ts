import express from 'express'
import objectHash from 'object-hash'
import cacheController from '@controllers/cacheController'
import userApiController from '@controllers/userApiController'
import { User } from '@models/UserModel'
import userServiceActions from '../../src/const/userServiceActions'

const app = express.Router()

type RouteResponse = User | null

app.get<{ user_id: string }, RouteResponse, {}, {}, {}>('/:user_id', async (req, res) => {
  const { user_id } = req.params

  const key = objectHash({
    action: userServiceActions.GET_USER,
    params: { user_id },
  })

  // not in middleware, because we need to format params
  const cacheResult = await cacheController.getCache(key)
  if (cacheResult?.exists) {
    console.log('return cached data')
    // here we handle only successful requests, but potentially we can handle errors too...
    return res.send(cacheResult.value)
  }

  const result = await userApiController.getUser(user_id)

  res.send(result)

  // we don't need to wait for reply here. Added just to save time
  await cacheController.saveCache({ key, value: result })
})

export default app
