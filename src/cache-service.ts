import serviceStartup from 'service-startup'
import { getChannel } from '../libs/amqpClient'
import cacheServiceActions from './const/cacheServiceActions'
import cache from './lib/cacheStore'

const q = 'CACHE_SERVICE'

async function start() {
  const channel = getChannel()
  channel.assertQueue(q, { durable: false })
  channel.prefetch(1)
  console.log('Awaiting RPC Requests')
  channel.consume(q, async msg => {
    const message = msg?.content?.toString()
    const data = JSON.parse(message || '')
    console.log('NEW MESSAGE:', data)
    let tStart = Date.now()

    let result: any
    switch (data.action) {
      case cacheServiceActions.PING: {
        result = { pong: true}
        break
      }

      case cacheServiceActions.SET: {
        const { key, value } = data.params
        cache.add(key, value)
        break
      }

      case cacheServiceActions.GET: {
        const { key } = data.params

        const item = cache.getItem(key)

        result = {
          exists: !!item, // cache can be empty for some api requests
          value: item?.data,
        }
        break
      }

      default:
        result = { error: 'action is not supported' }
    }

    const time = Date.now() - tStart


    const str = JSON.stringify({ result, time })
    channel.sendToQueue(msg.properties.replyTo,
      Buffer.from(str),
      { correlationId: msg.properties.correlationId })
    channel.ack(msg)

    console.log('message processed in', `${time}ms`)
  })
}

serviceStartup.start().then(() => start())
