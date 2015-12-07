'use strict'

const exec = require('child_process').exec
const async = require('async')
const parseOutput = require('./parse-available-ios-devices').parseOutput

function hasBooted(deviceID, cb) {

  exec(`xcrun simctl list | grep '${deviceID}'`, function(err, stdout){
    if (err) { return cb(err) }
    let output = stdout.toString()
    let result = false
    if(output.indexOf('Booted') > -1) {
      result = true
    }
    cb(null, result)
  })

}

module.exports = {
  startAndOpenUrl: function startAndOpenUrl(version, deviceName, url, done) {
    var _this = this
    async.auto({
      device: function(cb){
        _this.getDevice(version, deviceName, cb)
      },
      startDevice: ['device', function(cb, results) {
        if (results.device.state === 'Shutdown') {
          _this.startDevice(results.device.id, cb)
        } else {
          cb(null)
        }
      }],
      openURL: ['startDevice', function openURL(cb, results){
        _this.openURL(results.device.id, url, cb)
      }]
    }, done)
  },
  availableDevices: function availableDevices(cb) {
    exec('xcrun simctl list', function(err, stdout){
      if (err){ return cb(err) }
      let versions = parseOutput(stdout.toString())
      cb(null, versions)
    })
  },
  startDevice: function startDevice(deviceID, cb) {
    exec(`open -n -a Simulator --args -CurrentDeviceUDID '${deviceID}'`, function(err, stdout){
      if (err){ return cb(err) }
      async.during(
        function test(cb) {
          hasBooted(deviceID, function(err, isBooted){
            cb(err, !isBooted)
          })
        },
        function wait(cb) {
          console.log('waiting for device to boot')
          setTimeout(cb, 100)
        },
        cb
      )
    })
  },
  getDevice: function getDevice(version, deviceName, cb){
    this.availableDevices(function(err, versions) {
      if (err) {
        cb(err)
        return
      }
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
    })
  },
  openURL: function openURL(deviceID, url, cb){
    exec(`xcrun simctl openurl ${deviceID} ${url}`, function(err, stdout){
      cb(err)
    })
  }
}
