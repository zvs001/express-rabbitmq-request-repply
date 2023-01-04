import keyManager from 'constant-manager'

export const QUEUE = 'CACHE_SERVICE'

const cacheServiceActions = keyManager({
  PING: '',
  GET: '',
  SET: '',
}, {
  prefix:  `${QUEUE}@`,
})

export default cacheServiceActions
