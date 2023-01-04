import _ from 'lodash'
import moment from 'moment'

class Store {
  state: {
    [key: string]: {
      ttl: number
      data: any
    }
  } = {}

  cleanIntervalMs = 10_000 // 10 seconds

  interval: any

  constructor() {
    this.interval = setInterval(() => {
      _.keys(this.state).forEach(key => {
        const item = this.state[key]
        if (item.ttl < Date.now()) {
          delete this.state[key]
        }
      })
    }, this.cleanIntervalMs)
  }

  add(key: string, data: any) {
    const momentTTL = moment().add(1, 'minute')
    this.state[key] = { data, ttl: momentTTL.valueOf() }
  }

  get(key: string) {
    const item = this.state[key]
    return item?.data
  }

  getItem(key: string) {
    const item = this.state[key]
    return item
  }
}

const cache = new Store()

// just log status of store
setInterval(() => {
  console.log('cache', cache.state)
}, 5000)

export default cache
