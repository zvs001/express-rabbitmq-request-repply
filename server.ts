import serviceStartup from 'service-startup'
import userServer from './api/router'
import app from './libs/express/expressRouter'

app.use('/', userServer)

// 404 Not found
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Api not found' })
})

serviceStartup.start().then(() => {
  app.listen(4444, () => {
    console.log(`Listening port: ${4444}`)
  })
})

export default app
