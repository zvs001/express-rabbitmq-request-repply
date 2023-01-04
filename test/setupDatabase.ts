// eslint-disable-next-line import/no-extraneous-dependencies
import serviceStartup from 'service-startup'

import '../libs/mongooseConnect'

before(async () => {
  await serviceStartup.start()
})
