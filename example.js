var request = require('request')

var poller = require('./index')

var ghUser = poller(action, 1000)

function userCb (data) {
  console.log('got some data', data.public_repos)
}

ghUser.on('data', userCb)

setTimeout(function () {
  ghUser.removeListener('data', userCb)
}, 5000)

function action (cb) {
  request(
    {
      headers: {
        'User-Agent': 'request'
      },
      uri: 'https://api.github.com/users/thebearingedge',
      json: true,
      method: 'GET'
    },
    function (err, res, data) {
      if (err) {
        return cb(err)
      }

      if (res.statusCode !== 200) {
        return cb(new Error('Non success statusCode'))
      }

      cb(null, data)
    }
  )
}
