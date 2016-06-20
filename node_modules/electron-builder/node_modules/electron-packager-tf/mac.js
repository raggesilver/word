'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')
const plist = require('plist')
const sign = require('electron-osx-sign')
const Promise = require('bluebird')

function rename (basePath, oldName, newName) {
  return fs.rename(path.join(basePath, oldName), path.join(basePath, newName))
}

function moveHelpers (frameworksPath, appName) {
  return Promise.map([' Helper', ' Helper EH', ' Helper NP'], function (suffix) {
    const executableBasePath = path.join(frameworksPath, `Electron${suffix}.app`, 'Contents', 'MacOS')
    return rename(executableBasePath, `Electron${suffix}`, appName + suffix)
      .then(() => rename(frameworksPath, `Electron${suffix}.app`, `${appName}${suffix}.app`))
  })
}

function filterCFBundleIdentifier (identifier) {
  // Remove special characters and allow only alphanumeric (A-Z,a-z,0-9), hyphen (-), and period (.)
  // Apple documentation: https://developer.apple.com/library/mac/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102070
  return identifier.replace(/ /g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
}

function createSignOpts (properties, platform, app) {
  // use default sign opts if osx-sign is true, otherwise clone osx-sign object
  var signOpts = properties === true ? {identity: null} : Object.assign({}, properties)

  // osx-sign options are handed off to sign module, but
  // with a few additions from the main options
  // user may think they can pass platform or app, but they will be ignored
  common.subOptionWarning(signOpts, 'osx-sign', 'platform', platform)
  common.subOptionWarning(signOpts, 'osx-sign', 'app', app)

  if (signOpts.binaries) {
    console.warn('WARNING: osx-sign.binaries signing will fail. Sign manually, or with electron-osx-sign.')
  }

  // Take argument osx-sign as signing identity:
  // if opts['osx-sign'] is true (bool), fallback to identity=null for
  // autodiscovery. Otherwise, provide signing certificate info.
  if (signOpts.identity === true) {
    signOpts.identity = null
  }

  return signOpts
}

module.exports = {
  createApp: function createApp (opts, tempPath) {
    const appRelativePath = path.join('Electron.app', 'Contents', 'Resources', 'app')
    const finalAppPath = path.join(tempPath, `${opts.name}.app`)
    const contentsPath = path.join(tempPath, 'Electron.app', 'Contents')
    const frameworksPath = path.join(contentsPath, 'Frameworks')

    const appPlistFilename = path.join(contentsPath, 'Info.plist')
    const helperPlistFilename = path.join(frameworksPath, 'Electron Helper.app', 'Contents', 'Info.plist')
    const helperEHPlistFilename = path.join(frameworksPath, 'Electron Helper EH.app', 'Contents', 'Info.plist')
    const helperNPPlistFilename = path.join(frameworksPath, 'Electron Helper NP.app', 'Contents', 'Info.plist')

    return Promise.all([
      common.initializeApp(opts, tempPath, appRelativePath),
      Promise.map([appPlistFilename, helperPlistFilename, helperEHPlistFilename, helperNPPlistFilename, opts['extend-info']],
        (file) => file == null ? null : fs.readFile(file, 'utf8'))
    ])
      .then((result) => {
        const fileContents = result[1]
        const appPlist = plist.parse(fileContents[0])
        const helperPlist = plist.parse(fileContents[1])
        const helperEHPlist = plist.parse(fileContents[2])
        const helperNPPlist = plist.parse(fileContents[3])

        // If an extend-info file was supplied, copy its contents in first
        if (opts['extend-info']) {
          Object.assign(appPlist, plist.parse(fileContents[4]))
        }

        // Now set fields based on explicit options

        const appBundleIdentifier = filterCFBundleIdentifier(opts['app-bundle-id'] || 'com.electron.' + opts.name.toLowerCase())
        const helperBundleIdentifier = filterCFBundleIdentifier(opts['helper-bundle-id'] || appBundleIdentifier + '.helper')

        const appVersion = opts['app-version']
        const buildVersion = opts['build-version']
        const appCategoryType = opts['app-category-type']
        const humanReadableCopyright = opts['app-copyright']

        appPlist.CFBundleDisplayName = opts.name
        appPlist.CFBundleIdentifier = appBundleIdentifier
        appPlist.CFBundleName = opts.name
        helperPlist.CFBundleDisplayName = opts.name + ' Helper'
        helperPlist.CFBundleIdentifier = helperBundleIdentifier
        appPlist.CFBundleExecutable = common.sanitizeExecutableFilename(opts.name)
        helperPlist.CFBundleName = opts.name
        helperPlist.CFBundleExecutable = opts.name + ' Helper'
        helperEHPlist.CFBundleDisplayName = opts.name + ' Helper EH'
        helperEHPlist.CFBundleIdentifier = helperBundleIdentifier + '.EH'
        helperEHPlist.CFBundleName = opts.name + ' Helper EH'
        helperEHPlist.CFBundleExecutable = opts.name + ' Helper EH'
        helperNPPlist.CFBundleDisplayName = opts.name + ' Helper NP'
        helperNPPlist.CFBundleIdentifier = helperBundleIdentifier + '.NP'
        helperNPPlist.CFBundleName = opts.name + ' Helper NP'
        helperNPPlist.CFBundleExecutable = opts.name + ' Helper NP'

        if (appVersion) {
          appPlist.CFBundleShortVersionString = appPlist.CFBundleVersion = '' + appVersion
        }

        if (buildVersion) {
          appPlist.CFBundleVersion = '' + buildVersion
        }

        if (opts.protocols && opts.protocols.length) {
          appPlist.CFBundleURLTypes = opts.protocols.map(function (protocol) {
            return {
              CFBundleURLName: protocol.name,
              CFBundleURLSchemes: [].concat(protocol.schemes)
            }
          })
        }

        if (appCategoryType) {
          appPlist.LSApplicationCategoryType = appCategoryType
        }

        if (humanReadableCopyright) {
          appPlist.NSHumanReadableCopyright = humanReadableCopyright
        }

        const promises = [
          fs.writeFile(appPlistFilename, plist.build(appPlist)),
          fs.writeFile(helperPlistFilename, plist.build(helperPlist)),
          fs.writeFile(helperEHPlistFilename, plist.build(helperEHPlist)),
          fs.writeFile(helperNPPlistFilename, plist.build(helperNPPlist)),
          rename(path.join(contentsPath, 'MacOS'), 'Electron', appPlist.CFBundleExecutable)
        ]

        // Copy in the icon, if supplied
        if (opts.icon) {
          promises.push(common.normalizeExt(opts.icon, '.icns')
            .then((icon) => {
              if (icon != null) {
                return fs.copy(icon, path.join(contentsPath, 'Resources', appPlist.CFBundleIconFile))
              }
            }))
        }

        // Copy in any other extras
        let extras = opts['extra-resource']
        if (extras) {
          if (!Array.isArray(extras)) extras = [extras]
          promises.push(Promise.map(extras, (val) => fs.copy(val, path.join(contentsPath, 'Resources', path.basename(val)))))
        }

        return Promise.all(promises)
      })
      .then(() => moveHelpers(frameworksPath, opts.name))
      .then(() => fs.rename(path.dirname(contentsPath), finalAppPath))
      .then(() => {
        if ((opts.platform === 'all' || opts.platform === 'mas') && opts['osx-sign'] === undefined) {
          console.warn('WARNING: signing is required for mas builds. Provide the osx-sign option, or manually sign the app later.')
        }

        if (opts['osx-sign']) {
          return Promise.promisify(sign)(createSignOpts(opts['osx-sign'], opts.platform, finalAppPath))
            .catch((err) => {
              // Although not signed successfully, the application is packed.
              console.warn('Code sign failed; please retry manually.', err)
            })
        }
      })
  },
  createSignOpts: createSignOpts,
  filterCFBundleIdentifier: filterCFBundleIdentifier
}
