import keyManager from 'constant-manager'

export const queue = 'USERS_SERVICE'

const userServiceActions = keyManager({
  PING: '',
  GET_USER: '',
  GET_LIST: '',
  GET_TOTAL: '',
}, {
  prefix: `${queue}@`,
})

export default userServiceActions
