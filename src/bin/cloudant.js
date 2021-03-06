const getConfig = require('../config/cloudant')
const Cloudant = require('@cloudant/cloudant')
const cloudantDebug = require('debug')('easevest-api:cloudant:')

const config = getConfig()

/**
 * @param {{url: String, iamApiKey: string}} params
 * @returns {Cloudant.ServerScope}
 */
const getCloudant = (params) => {
  const { url, iamApiKey } = params
  return Cloudant({
    url,
    maxAttempt: 5,
    plugins: [{
      iamauth: { iamApiKey },
    }, {
      retry: {
        retryErrors: false,
      },
    },
    'promises',
    ],
  })
}

/**
 * @returns {Cloudant.ServerScope}
 */
const initDBConnection = () => {
  const cloudant = getCloudant(config)
  cloudantDebug('Connected to cloudant.')
  return cloudant
}

const getDatabase = (dbName) => {
  const conn = initDBConnection()
  return conn.db.use(dbName)
}

module.exports = {
  initDBConnection,
  getDatabase,
}
