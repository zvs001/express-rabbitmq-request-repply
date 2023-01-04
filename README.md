

Step 1:

Install dependencies.
Check mongo/rabbit connection in .env or .env.local files.


Step 2:

Create random users using cmd: `npx gulp createUsers`

Step 3:

Start services:
- `node startUsersService.js`
- `node startCacheService.js`


Step 4. Start main server

- `node startServer.js`


Step 5: Tests

You can run: `npm run test`. Or you can find tests nears api routes under  `./api` folder
Tests connect to running services and RabbitMQ, so make sure it is running.
