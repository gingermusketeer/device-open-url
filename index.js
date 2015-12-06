'use strict'
let version = process.argv[2]
let deviceName = process.argv[3]
let url = process.argv[4]

const async = require('async')
const ios = require('./lib/ios')

async.auto({
  device: function(cb){
    ios.getDevice(version, deviceName, cb)
  },
  startDevice: ['device', function(cb, results) {
    if (results.device.state === 'Shutdown') {
      ios.startDevice(results.device.id, cb)
    } else {
      cb(null)
    }
  }],
  openURL: ['startDevice', function openURL(cb, results){
    ios.openURL(results.device.id, url, cb)
  }]
}, function completed(err) {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    // Sleep until testem kills us
    while (true);;
  }
})
