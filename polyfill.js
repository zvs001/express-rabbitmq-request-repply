require('dotenv').config({ path: './.env.local' })
require('dotenv').config()

// require('ts-node/register')
// require('tsconfig-paths/register')
require('@babel/register')({
  extensions: ['.js', '.ts'],
  babelrcRoots: [
    '.',
    './packages/asset-uploader/',
    './packages/*',
  ],
  // cache: false,
})
