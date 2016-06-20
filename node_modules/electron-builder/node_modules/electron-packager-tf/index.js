'use strict'

const Promise = require('bluebird')
const common = require('./common')
const download = Promise.promisify(require('electron-download'))
const extract = require('extract-zip')
const fs = require('fs-extra')
const promisifiedFs = require('fs-extra-p')
const getPackageInfo = Promise.promisify(require('get-package-info'))
const os = require('os')
const path = require('path')
const resolve = Promise.promisify(require('resolve'), {multiArgs: true})
const series = require('run-series')

const supportedArchs = common.archs.reduce(function (result, arch) {
  result[arch] = 1
  return result
}, {})

const supportedPlatforms = {
  // Maps to module ID for each platform (lazy-required if used)
  darwin: './mac',
  linux: './linux',
  mas: './mac', // map to darwin
  win32: './win32'
}

function validateList (list, supported, name) {
  // Validates list of architectures or platforms.
  // Returns a normalized array if successful, or an error message string otherwise.

  if (!list) return `Must specify ${name}`
  if (list === 'all') return Object.keys(supported)

  if (!Array.isArray(list)) list = list.split(',')
  for (var i = list.length; i--;) {
    if (!supported[list[i]]) {
      return `Unsupported ${name} ${list[i]}; must be one of: ${Object.keys(supported).join(', ')}`
    }
  }

  return list
}

function getNameAndVersion (opts, dir) {
  var props = []
  if (!opts.name) props.push(['productName', 'name'])
  if (!opts.version) props.push(['dependencies.electron-prebuilt', 'devDependencies.electron-prebuilt'])

  // Name and version provided, no need to infer
  if (props.length === 0) return Promise.resolve()

  // Search package.json files to infer name and version from
  return getPackageInfo(props, dir)
    .then((result) => {
      if (result.values.productName) opts.name = result.values.productName
      if (result.values['dependencies.electron-prebuilt']) {
        return resolve('electron-prebuilt', {basedir: path.dirname(result.source['dependencies.electron-prebuilt'].src)})
          .then((results) => {
            opts.version = results[1].version
          })
      }
    })
}

function createPromise (opts, archs, platforms) {
  const tempBase = path.join(opts.tmpdir || os.tmpdir(), 'electron-packager')

  function testSymlink (cb) {
    var testPath = path.join(tempBase, 'symlink-test')
    var testFile = path.join(testPath, 'test')
    var testLink = path.join(testPath, 'testlink')
    series([
      function (cb) {
        fs.outputFile(testFile, '', cb)
      },
      function (cb) {
        fs.symlink(testFile, testLink, cb)
      }
    ], function (err) {
      const result = !err
      fs.remove(testPath, function () {
        // ignore errors on cleanup
        cb(null, result)
      })
    })
  }

  var combinations = []
  archs.forEach(function (arch) {
    platforms.forEach(function (platform) {
      // Electron does not have 32-bit releases for Mac OS X, so skip that combination
      if (common.isPlatformMac(platform) && arch === 'ia32') return
      combinations.push(common.createDownloadOpts(opts, platform, arch))
    })
  })

  const useTempDir = opts.tmpdir !== false
  return Promise.mapSeries(combinations, (combination) => {
    const arch = combination.arch
    const platform = combination.platform
    const version = combination.version

    // Create delegated options object with specific platform and arch, for output directory naming
    const comboOpts = Object.create(opts)
    comboOpts.arch = arch
    comboOpts.platform = platform

    const finalPath = common.generateFinalPath(comboOpts)

    return (useTempDir ? promisifiedFs.remove(tempBase) : Promise.resolve())
      .then(() => {
        console.log(`Packaging app for platform ${platform} ${arch} using electron ${version} to ${path.relative(process.cwd(), finalPath)}`)

        if (useTempDir && common.isPlatformMac(platform)) {
          return Promise.promisify(testSymlink)()
            .then((result) => {
              if (result) return true

              console.error(`Cannot create symlinks; skipping ${platform} platform`)
              return false
            })
        }
        return true
      })
      .then((valid) => {
        if (!valid || opts.overwrite) {
          return valid
        }

        return promisifiedFs.stat(finalPath)
          .catchReturn(false)
          .then((exists) => {
            if (exists) {
              console.error(`Skipping ${platform} ${arch} (output dir already exists, use --overwrite to force)`)
            }
            return !exists
          })
      })
      .then((valid) => valid ? download(combination) : null)
      .then((zipPath) => {
        if (zipPath === null) {
          return null
        }

        let buildDir
        if (useTempDir) {
          buildDir = path.join(tempBase, `${platform}-${arch}`, common.generateFinalBasename(comboOpts))
        } else {
          buildDir = finalPath
        }

        return promisifiedFs.emptyDir(buildDir)
          .then(() => Promise.promisify(extract)(zipPath, {dir: buildDir}))
          .then(() => require(supportedPlatforms[platform]).createApp(comboOpts, buildDir))
          .then(() => {
            if (useTempDir) {
              return promisifiedFs.move(buildDir, finalPath, {clobber: true})
            }
          })
      })
      .thenReturn(finalPath)
  })
}

function pack (opts) {
  const archs = validateList(opts.all ? 'all' : opts.arch, supportedArchs, 'arch')
  const platforms = validateList(opts.all ? 'all' : opts.platform, supportedPlatforms, 'platform')
  if (!Array.isArray(archs)) return Promise.reject(new Error(archs))
  if (!Array.isArray(platforms)) return Promise.reject(new Error(new Error(platforms)))

  return getNameAndVersion(opts, opts.dir || process.cwd())
    .catch((e) => {
      e.message = 'Unable to infer name or version. Please specify a name and version.\n' + e.message
      throw e
    })
    .then(() => {
      // Ignore this and related modules by default
      var defaultIgnores = ['/node_modules/electron-prebuilt($|/)', '/node_modules/electron-packager($|/)', '/\\.git($|/)', '/node_modules/\\.bin($|/)']

      if (typeof (opts.ignore) !== 'function') {
        if (opts.ignore && !Array.isArray(opts.ignore)) opts.ignore = [opts.ignore]
        opts.ignore = (opts.ignore) ? opts.ignore.concat(defaultIgnores) : defaultIgnores
      }

      return createPromise(opts, archs, platforms)
    })
    .then(appPaths => appPaths.filter(path => path != null))
}

module.exports = function (opts, cb) {
  pack(opts)
    .then(appPaths => cb(null, appPaths))
    .catch(cb)
}

module.exports.userIgnoreFilter = common.userIgnoreFilter
module.exports.pack = pack
