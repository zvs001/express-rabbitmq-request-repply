import { expect } from 'chai'
import agent from '../../tests/testServer'

describe('/users [GET]', () => {
  it('works', async () => {
    const { status, body } = await agent.get('/users')
    expect(status).to.equals(200)

    console.log('received items:', body.users.length)
    console.log('total available items:', body.count)
  })

  it('works with country filter', async () => {
    const { status, body } = await agent.get('/users').query({
      country: 'Ukraine',
    })
    expect(status).to.equals(200)

    console.log('received items:', body.users.length)
    console.log('total available items:', body.count)
  })

  it('works with city filter', async () => {
    const { status, body } = await agent.get('/users').query({
      city: 'Kyiv',
    })
    expect(status).to.equals(200)

    console.log('received items:', body.users.length)
    console.log('total available items:', body.count)
  })

  it('paging works', async () => {
    const { status, body } = await agent.get('/users').query({
      page: 20,
      limit: 45,
    })
    expect(status).to.equals(200)

    console.log('received items:', body.users.length)
    console.log('total available items:', body.count)
  })
})
