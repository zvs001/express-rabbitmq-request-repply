import { expect } from 'chai'
import invariant from 'invariant'
import UserModel from '@models/UserModel'
import agent from '../../tests/testServer'

describe('/users/:id [GET]', () => {
  it('works', async () => {
    const user = await UserModel.findOne()
    invariant(user, 'DB must have at least one user for test')

    const { status, body } = await agent.get(`/users/${user._id}`)
    expect(status).to.equals(200)

    expect(body).to.deep.include({
      name: user.name,
      city: user.city,
      country: user.country,
      _id: user._id.toString(),
    })

    expect(body).to.not.have.property('password')
  })
})
