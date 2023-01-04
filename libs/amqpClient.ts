import EventEmitter from 'events'
import amqp, { Channel } from 'amqplib'
import serviceStartup from 'service-startup'
import { v4 as uuid } from 'uuid'

// this queue name will be attached to "replyTo" property on producer's message,
// and the consumer will use it to know which queue to the response back to the producer
const REPLY_QUEUE = 'amq.rabbitmq.reply-to'
const { RABBITMQ_URL } = process.env

const responseEmitter = new EventEmitter()
responseEmitter.setMaxListeners(0)

let channel: Channel

serviceStartup.addStep({
  name: 'RabbitMQ',
  async onRun() {
    channel = await createClient({ url: RABBITMQ_URL || 'amqp://localhost' })

    await channel.consume(REPLY_QUEUE,
      msg => {
        const msgStr = msg?.content.toString()
        const data = JSON.parse(msgStr || '')
        responseEmitter.emit(msg.properties.correlationId, data)
      },
      { noAck: true })
  },
})

/**
 * Create amqp channel and return back as a promise
 * @params {Object} setting
 * @params {String} setting.url
 * @returns {Promise} - return amqp channel
 */
const createClient = setting => amqp.connect(setting.url)
  .then(conn => conn.createChannel()) // create channel

/**
 * Send RPC message to waiting queue and return promise object when
 * event has been emitted from the "consume" function
 * @params {Object} channel - amqp channel
 * @params {String} message - message to send to consumer
 * @params {String} rpcQueue - name of the queue where message will be sent to
 * @returns {Promise} - return msg that send back from consumer
 */
const sendRPCMessage = (topic: string, data: Record<string, any>): Promise<any> => new Promise(resolve => {
  // unique random string
  const correlationId = uuid()

  const message = JSON.stringify(data)
  responseEmitter.once(correlationId, resolve)
  channel.sendToQueue(topic, Buffer.from(message), { correlationId, replyTo: REPLY_QUEUE })
})

export function getChannel() {
  return channel
}
export default {
  sendRPCMessage,
}
