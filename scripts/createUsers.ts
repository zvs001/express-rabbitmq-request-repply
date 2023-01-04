import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import UserModel from '@models/UserModel'
import taskManager from './helpers/taskManager'

const countries = ['Ukraine', 'Germany', 'USA']
const cities = [
  ['Kyiv', 'Lviv', 'Odessa'],
  ['Berlin', 'Hamburg'],
  ['New York', 'Los Angeles', 'Arkham'],
]

async function createUsers() {
  for (let i = 0; i < 1000; i++) {
    const countryIndex = _.random(0, countries.length - 1, false)
    const countryCities = cities[countryIndex]
    const cityIndex = _.random(0, countryCities.length - 1, false)

    const name = uuid()

    const user = new UserModel({
      name,
      password: uuid(),
      email: `${uuid()}@gmail.com`,
      country: countries[countryIndex],
      city: countryCities[cityIndex],
    })
    await user.save()
    console.log('created user:', i, name)
  }
}

export default taskManager.createTask(createUsers)
