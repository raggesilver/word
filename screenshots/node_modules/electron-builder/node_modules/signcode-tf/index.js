var ChildProcess = require('child_process')
var fs = require('fs')
var path = require('path')
var os = require('os')

exports.sign = function (options, callback) {
  var signOptions = Object.assign({}, options)

  var hashes = signOptions.hash
  if (hashes) {
    hashes = Array.isArray(hashes) ? hashes.slice() : [hashes]
  } else {
    hashes = ['sha1', 'sha256']
  }

  var finalPath = process.platform === 'win32' ? signOptions.path : getOutputPath(signOptions.path)
  var signWithNextHash = function () {
    var hash = hashes.shift()
    var overwrite = signOptions.overwrite || process.platform === 'win32'
    if (!hash) {
      if (overwrite && finalPath !== options.path) {
        fs.rename(finalPath, options.path, function (error) {
          if (error) return callback(error)
          callback(null, options.path)
        })
      } else {
        callback(null, finalPath)
      }
      return
    }

    signOptions.hash = hash
    spawnSign(signOptions, overwrite ? finalPath : getOutputPath(options.path, options.hash), function (error, outputPath) {
      if (error) return callback(error)

      function next () {
        signOptions.path = finalPath
        signOptions.nest = true
        signWithNextHash()
      }

      if (overwrite) {
        next()
      } else {
        fs.rename(outputPath, finalPath, function () {
          if (error) return callback(error)
          next()
        })
      }
    })
  }
  signWithNextHash()
}

exports.verify = function (options, callback) {
  spawnVerify(options, callback)
}

// on windows be aware of http://stackoverflow.com/a/32640183/1910191
function spawnSign (options, outputPath, callback) {
  var timestampingServiceUrl = 'http://timestamp.verisign.com/scripts/timstamp.dll'
  var isWin = process.platform === 'win32'
  var args = isWin ? [
    'sign',
    options.nest || options.hash == 'sha256' ? '/tr' : '/t', options.nest || options.hash == 'sha256' ? "http://timestamp.comodoca.com/rfc3161" : timestampingServiceUrl
  ] : [
    '-in', options.path,
    '-out', outputPath,
    '-t', timestampingServiceUrl
  ]

  var certExtension = path.extname(options.cert)
  if (certExtension === '.p12' || certExtension === '.pfx') {
    args.push(isWin ? '/f' : '-pkcs12', options.cert)
  } else {
    args.push(isWin ? '/f' : '-certs', options.cert)
    // todo win maybe incorrect
    args.push(isWin ? '/csp' : '-key', options.key)
  }

  if (options.hash) {
    if (!isWin || options.hash !== "sha1") {
      args.push(isWin ? '/fd' : '-h', options.hash)
      if (isWin) {
        args.push('/td', 'sha256')
      }
    }
  }

  if (options.name) {
    args.push(isWin ? '/d' : '-n', options.name)
  }

  if (options.site) {
    args.push(isWin ? '/du' : '-i', options.site)
  }

  if (options.nest) {
    args.push(isWin ? '/as' : '-nest')
  }

  if (options.password) {
    args.push(isWin ? '/p' : '-pass', options.password)
  }

  if (options.passwordPath) {
    if (isWin) {
      throw new Error('-readpass is not supported on Windows')
    }
    args.push('-readpass', options.passwordPath)
  }

  if (isWin) {
    // must be last argument
    args.push(options.path)
  }

  var spawnOptions = {
    env: process.env
  }

  if (options.password || options.passwordPath) {
    spawnOptions.detached = true
    spawnOptions.stdio = ['ignore', 'ignore', 'pipe']
  }

  // console.log("spawning " + getSigncodePath(options) + " " + args.join(' '));
  var signcode = ChildProcess.spawn(getSigncodePath(options), args, spawnOptions)

  var stderr = ''
  signcode.stderr.on('data', function (data) {
    stderr += data.toString()
  })

  signcode.on('close', function (code, signal) {
    if (code === 0) {
      callback(null, outputPath)
    } else {
      var message = 'Signing failed with'

      if (code != null) {
        message += ' ' + code
      }

      if (signal != null) {
        message += ' ' + signal
      }

      if (stderr) {
        var errorOutput = formatErrorOutput(stderr)
        if (errorOutput) {
          message += '. ' + errorOutput
        }
      }
      callback(Error(message))
    }
  })
}

function spawnVerify (options, callback) {
  var args = [
    'verify',
    '-in',
    options.path,
    '-require-leaf-hash',
    options.hash
  ]

  var signcode = ChildProcess.spawn(getSigncodePath(options), args)

  var stdout = ''
  signcode.stdout.on('data', function (data) {
    stdout += data.toString()
  })

  signcode.on('close', function (code, signal) {
    if (stdout.indexOf('No signature found.') !== -1) {
      return callback(Error('No signature found'))
    } else if (stdout.indexOf('Leaf hash match: failed') !== -1) {
      return callback(Error('Leaf hash match failed'))
    } else if (code === 0) {
      callback()
    } else {
      var message = 'osslsigncode verifying failed: '
      if (code != null) {
        message += ' ' + code
      }
      if (signal != null) {
        message += ' ' + signal
      }
      callback(Error(message))
    }
  })
}

function formatErrorOutput (output) {
  return output.split('\n').filter(function (line) {
    return !/^\d+:|osslsigncode\(|\*\*\*\s/.test(line)
  }).join('\n')
}

function getOutputPath (inputPath, hash) {
  var extension = path.extname(inputPath)
  var name = path.basename(inputPath, extension)
  var outputName = name + '-signed'
  if (hash) outputName += '-' + hash
  outputName += extension
  return path.join(path.dirname(inputPath), outputName)
}

function getSigncodePath (options) {
  var result = options.signcodePath || process.env.SIGNTOOL_PATH
  if (result) {
    return result
  }
  if (process.env.USE_SYSTEM_SIGNCODE || process.platform === 'linux') {
    return "osslsigncode"
  }
  
  if (process.platform === 'win32') {
    return path.join(__dirname, 'vendor', 'windows-' + (os.release().startsWith('6.') ? '6' : '10'), 'signtool.exe')
  } else {
    return path.join(__dirname, 'vendor', process.platform, 'osslsigncode')
  }
}
