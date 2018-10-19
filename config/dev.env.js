'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://10.213.204.89:8762"'
  // BASE_API: '"http://10.213.204.60:18762"'
  BASE_API: '"http://119.6.241.135:8762"'
})
