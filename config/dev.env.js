'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
<<<<<<< HEAD
  BASE_API: '"http://10.213.204.88:8861/gis"',
=======
  BASE_API: '"http://10.213.204.21:18762"',
>>>>>>> 04753b41079991e3beb939a3159f98e3453f127e
})
