import invariant from 'invariant'
import mongoose from 'mongoose'
import serviceStartup from 'service-startup'

const { MONGO_URL } = process.env
invariant(MONGO_URL, 'MONGO_URL must be set for this module')

serviceStartup.addStep({
  name: 'Mongo',
  async onRun() {
    mongoose.set('strictQuery', false)
    await mongoose.connect(MONGO_URL)
    // mongoose.set('debug', true)
  },

})

export default mongoose
