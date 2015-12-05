'use strict'

function splitGroups(delimiter, str) {
  let groups = str.split(new RegExp(delimiter, 'm')).map(function (group) {
    return group.trim()
  }).filter(function(group){
    return group.length > 0
  })
  let result = {}
  for(let i = 0; i < groups.length; i += 2) {
    let title = groups[i]
    let content = groups[i + 1]
    result[title] = content
  }
  return result
}

function parseOutput(output) {
  let groupings = splitGroups('==', output)
  let  devices = groupings['Devices']

  let types = splitGroups('--', devices)

  let availableIOSTypes = Object.keys(types).filter(function(type){
    return type.indexOf('iOS ') > -1
  }).reduce(function(result, type){
    result[type] = types[type]
    return result
  }, {})

  return Object.keys(availableIOSTypes).reduce(function(parsedTypes, type){
    let raw = availableIOSTypes[type]
    let lines = raw.split("\n")
    parsedTypes[type.replace('iOS ', '').trim()] = lines.reduce(function(result, line){
      // "iPhone 4s (B7E5F3CF-5485-4978-A576-8392FAC6CE97) (Shutdown)"
      let matches = line.replace(/\)/g, '').split('(')
      let name = matches[0].trim()
      result[name] = {
        id: matches[1].trim(),
        state: matches[2].trim()
      }
      return result
    }, {})
    return parsedTypes
  }, {})
}

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
