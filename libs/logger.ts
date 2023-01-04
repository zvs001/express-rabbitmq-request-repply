const _ = require('lodash')
const winston = require('winston')
// const { format } = winston
const {
  combine, timestamp, label, prettyPrint, printf,
} = winston.format

const colors = require('colors')

colors.enabled = true
// colors.setTheme({
//   silly: 'rainbow',
//   input: 'grey',
//   verbose: 'cyan',
//   prompt: 'grey',
//   info: 'green',
//   data: 'grey',
//   help: 'cyan',
//   warn: 'yellow',
//   debug: 'blue',
//   error: 'red'
// });

/*
function getFiles(n = 2) {
  const e = new Error().stack
  const match = e.match(/(?!\()[\w\-\_\/\.]+:\d+:\d+(?!\))/g)
    .filter(p => p.indexOf('node_modules/') === -1)
    .filter(p => p.indexOf('logger.js') === -1)
    .filter(p => p.indexOf('packages/modules-runtime.js') === -1)
    .map(p => p.replace('imports/api/', ''))

  return _.isEmpty(match) ? '' : match.join(', ')
} */

const loggerInstance = winston.createLogger({
  format: combine(
    timestamp(),
    printf(info => {
      const { level, message, timestamp } = info

      const particles = [colors.blue(timestamp)]

      let statusStr = `[${level.toUpperCase()}]`
      if (['info'].indexOf(level) !== -1) particles.push(colors.green(statusStr))
      if (['error'].indexOf(level) !== -1) particles.push(colors.red(statusStr))

      particles.push(message)

      // const files = getFiles()
      // if (files) particles.push(colors.yellow(`[${files}]`))

      return _.compact(particles).join(' ')
    }),
  ),
  transports: [
    new (winston.transports.Console)(),
  ],
})

// const loggerFile = winston.createLogger({
//   level: 'error',
//   transports: [
//     new (winston.transports.Console)(),
//     // new (winston.transports.File)({
//     //   filename: config.logs.file,
//     //   handleExceptions: true,
//     //   humanReadableUnhandledException: true,
//     // }),
//   ],
// });

// make it global

function processArgs(...args) {
  args = args.map(item => {
    if (_.isObject(item)) {
      if (item instanceof Error) {
        return item.stack
      }

      item = JSON.stringify(item, null, 2)
      // if (item.length < 160) item = item.replace(/\n/, '');
    }

    return item
  })

  return args
}

export function createLogger(...argsPre: any) {
  return {
    log: (...args) => loggerInstance.log('info', processArgs(...argsPre, ...args).join(' ')),
    error: (...args) => loggerInstance.log('error', processArgs(...argsPre, ...args).join(' ')),
  }
}

const logger = createLogger()
console.error = logger.error

export default logger
