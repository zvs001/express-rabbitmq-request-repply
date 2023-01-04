/* eslint-disable no-console */
import serviceStartup from 'service-startup'

import '../../libs/mongooseConnect'

// todo we can do pg.connect and close here
function createTask(fn: () => Promise<any> | any) {
  return async done => {
    try {
      await serviceStartup.start()
      await fn()
      done()
    } catch (e) {
      done(e)
    }
  }
}

export default { createTask }
