'use strict'
const parseOutput = require('./lib/parse-available-ios-devices').parseOutput

let version = process.argv[2]
let deviceName = process.argv[3]
let url = process.argv[4]

const execSync = require('child_process').execSync

let output = execSync('xcrun simctl list').toString()
let versions = parseOutput(output)

let devices = versions[version]
let device
if (devices){
  device = devices[deviceName]
  if (!device) {
    console.log(
      `Invalid ios device provided. Got ${device} options are ${Object.keys(devices)}`)
    process.exit(1)
  }
} else {
  console.log(
    `Invalid version provided. Got ${version} options are ${Object.keys(versions)}`
  )
  process.exit(1)
}
let deviceID = device['id']

if (device['state'] === 'Shutdown') {
  let output = execSync(`open -n -a Simulator --args -CurrentDeviceUDID '${deviceID}'`).toString()
  while (true) {
    console.log('waiting for device to boot')

    let output = execSync(`xcrun simctl list | grep '${deviceID}'`).toString()
    if(output.indexOf('Booted') > -1) {
      break
    }
  }
}

let openOutput = execSync(`xcrun simctl openurl ${deviceID} ${url}`).toString()

console.log(openOutput)
