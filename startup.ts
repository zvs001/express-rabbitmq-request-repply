import checkNodeVersion from 'check-node-version'
import _ from 'lodash'
import serviceStartup from 'service-startup'
import packageJson from './package.json'

serviceStartup.addPrioritizedSteps([
  {
    name: 'Lib Versions',
    onRun() {
      return new Promise<void>((resolve, reject) => {
        checkNodeVersion(
          {
            node: packageJson.engines.node,
            // no need for npm check
          },
          (error, result) => {
            if (error) return reject(error)

            _.keys(result.versions).forEach(key => {
              const lib = result.versions[key]
              if (lib.isSatisfied) return null
              console.error('version conflict:', key, lib.wanted?.range)
            })

            if (result.isSatisfied) resolve()
            else reject(new Error('Update libs before starting server.'))
          },
        )
      })
    },
  },
])
