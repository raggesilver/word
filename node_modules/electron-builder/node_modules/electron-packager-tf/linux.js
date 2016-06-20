'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')

module.exports = {
  createApp: function createApp (opts, buildDir) {
    return common.initializeApp(opts, buildDir, path.join('resources', 'app'))
      .then(() => fs.rename(path.join(buildDir, 'electron'), path.join(buildDir, opts.name)))
  }
}
