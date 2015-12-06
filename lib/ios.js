'use strict'

const execSync = require('child_process').execSync
const parseOutput = require('./parse-available-ios-devices').parseOutput


function hasBooted(deviceID) {
  let result = false
  let output = execSync(`xcrun simctl list | grep '${deviceID}'`).toString()
  if(output.indexOf('Booted') > -1) {
    result = true
  }
  return result
}

module.exports = {
  availableDevices: function availableDevices(cb) {
    let output = execSync('xcrun simctl list').toString()
    let versions = parseOutput(output)
    cb(null, versions)
  },
  startDevice: function startDevice(deviceID, cb) {
    let output = execSync(`open -n -a Simulator --args -CurrentDeviceUDID '${deviceID}'`).toString()
    while (true) {
      console.log('waiting for device to boot')
      if (hasBooted(deviceID)) {
        break
      }
    }
    cb(null)
  },
  openURL: function openURL(deviceID, url, cb){
    let openOutput = execSync(`xcrun simctl openurl ${deviceID} ${url}`).toString()
    cb(openOutput.trim())
  }
}
