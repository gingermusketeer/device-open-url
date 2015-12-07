# Device Open URL

Opens urls on devices such as iOS simulators. This is helpful when using tools like testem to simplify testing on mobile devices

## Usage
`device-open-url ios 9.1 'iPhone 6' 'https://google.com'`

### With testem

1. `npm install --save device-open-url`
2. Edit your testem.json config file to something like
```json
{
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launch_in_ci": [
    "iPhone, iOS 9.1",
    "iPad Air, iOS 8.4"
  ],
  "launch_in_dev": [
    "iPhone, iOS 9.1",
    "iPad Air, iOS 8.4"
  ],
  "launchers": {
    "iPhone, iOS 9.1": {
      "protocol": "browser",
      "exe": "./node_modules/.bin/device-open-url",
      "args": ["ios", "9.1", "iPhone 6s"]
    },
    "iPad Air, iOS 8.4": {
      "protocol": "browser",
      "exe": "./node_modules/.bin/device-open-url",
      "args": ["ios", "8.4", "iPad Air"]
    }
  }
}
```
