import serviceStartup from 'service-startup'
import amqpClient from '@libs/amqpClient'
import userServiceActions, { queue as USERS_QUEUE } from '../src/const/userServiceActions'

serviceStartup.addStep({
  name: 'Users Service',
  async onRun() {
    await amqpClient.sendRPCMessage(USERS_QUEUE, {
      action: userServiceActions.PING,
    })
  },
})

async function getUser(user_id: string) {
  const response = await amqpClient.sendRPCMessage(USERS_QUEUE, {
    action: userServiceActions.GET_USER,
    params: {
      user_id,
    },
  })

  const { result } = response || {}

  return result
}

async function getList(queryData: {
  offset: number
  limit: number
  country?: string
  city?: string
}) {
  const response = await amqpClient.sendRPCMessage(USERS_QUEUE, {
    action: userServiceActions.GET_LIST,
    params: {
      ...queryData,
    },
  })

  return response.result
}

export default {
  getUser,
  getList,
}
