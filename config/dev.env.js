'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://119.6.241.135:8762"'
  // BASE_API: '"http://10.213.204.61:8860"'
  // BASE_API: '"http://10.213.204.86:8861"'
})
