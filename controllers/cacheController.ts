import serviceStartup from 'service-startup'
import amqpClient from '@libs/amqpClient'
import cacheServiceActions, { QUEUE as CACHE_QUEUE } from '../src/const/cacheServiceActions'

serviceStartup.addStep({
  name: 'Cache Service',
  async onRun() {
    await amqpClient.sendRPCMessage(CACHE_QUEUE, {
      action: cacheServiceActions.PING,
    })
  },
})

async function getCache(key: string): Promise<{ exists: boolean; value: any}> {
  // not in middleware, because we need to format params
  const cacheResponse = await amqpClient.sendRPCMessage(CACHE_QUEUE, {
    action: cacheServiceActions.GET,
    params: {
      key,
    },
  })
  const cacheResult = cacheResponse?.result

  return cacheResult
}

async function saveCache(params: { key: string; value: any}) {
  await amqpClient.sendRPCMessage(CACHE_QUEUE, {
    action: cacheServiceActions.SET,
    params,
  })
}

export default {
  getCache,
  saveCache,
}
