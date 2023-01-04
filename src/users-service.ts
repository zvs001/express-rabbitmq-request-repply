import _ from 'lodash'
import serviceStartup from 'service-startup'
import UserModel from '@models/UserModel'
import { getChannel } from '../libs/amqpClient'
import userServiceActions from './const/userServiceActions'

import '../libs/mongooseConnect'

const q = 'USERS_SERVICE'

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
      case userServiceActions.PING: {
        result = { pong: true}
        break
      }

      case userServiceActions.GET_USER: {
        const { user_id } = data.params
        const user = await UserModel.findById(user_id)
        result = user ? user.toPublic() : null
        break
      }

      case userServiceActions.GET_LIST: {
        const {
          offset, limit, country, city,
        } = data.params

        const mongoFilter: {
          city?: string
          country?: string
        } = {}
        if (country) mongoFilter.country = country
        if (city) mongoFilter.city = city

        const count = await UserModel.find(mongoFilter).count()
        const list = await UserModel.find(mongoFilter).limit(limit).skip(offset).sort({ createdAt: -1 })
        const listPublic = _.map(list, item => item.toPublic())

        result = { users: listPublic, count }
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
