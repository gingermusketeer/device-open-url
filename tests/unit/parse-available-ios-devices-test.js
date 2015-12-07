'use strict'
const test = require('tape')
const fs = require('fs')

const parseOutput = require('../../lib/parse-available-ios-devices').parseOutput

test('parsing the output', function (t) {
  t.plan(1)

  let testOutput = fs.readFileSync(
    __dirname +'/../fixtures/xcrun-simctl-list-output.txt'
  ).toString()

  let versions = parseOutput(testOutput)
  t.deepEqual(versions, {
    '8.4': {
      'iPad 2': {
        id: 'C97EB47C-C0B5-4304-86BD-9C5FECFD5EE1',
        state: 'Shutdown'
      },
      'iPhone 6': {
        id: 'CF0E352C-B2C5-4551-856E-21BBA93519A2',
        state: 'Booted'
      }
    },
    '9.1': {
      'iPad Air 2': {
        id: '30413063-E735-4FAE-B4FF-C90FDD922929',
        state: 'Booted'
      },
      'iPhone 6': { id: '0877C7B4-4D25-4BF6-85CB-2E893E875C11',
        state: 'Shutdown'
      }
    }
  })
})
