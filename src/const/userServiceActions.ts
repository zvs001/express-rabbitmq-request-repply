import keyManager from 'constant-manager'

const userServiceActions = keyManager({
  PING: '',
  GET_USER: '',
  GET_LIST: '',
  GET_TOTAL: '',
}, {
  prefix: 'USER_SERVICE@',
})

export default userServiceActions
