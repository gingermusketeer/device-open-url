'use strict'
let version = process.argv[2]
let deviceName = process.argv[3]
let url = process.argv[4]

const execSync = require('child_process').execSync
const async = require('async')
const ios = require('./lib/ios')

function device(cb, results){
  const versions = results.availableDevices
  let devices = versions[version]
  let device
  let error
  if (devices){
    device = devices[deviceName]
    if (!device) {
      error = `Invalid ios device provided. Got ${device} options are ` +
        `${Object.keys(devices)}`
    }
  } else {
    error = `Invalid version provided. Got ${version} options are ` +
      `${Object.keys(versions)}`
  }

  cb(error, device)
}

async.auto({
  availableDevices: ios.availableDevices,
  device: device,
  startDevice: function(cb, results) {
    if (results.device.state === 'Shutdown') {
      ios.startDevice(results.device.id, cb)
    } else {
      cb(null)
    }
  },
  openURL: function openURL(cb, results){
    ios.openURL(results.device.id, url, cb)
  }
}, function completed(err) {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    // Sleep until testem kills us
    while (true);;
  }
})
