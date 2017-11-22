var EventEmitter = require('events')

module.exports = function poller (action, freq) {
  var emitter = new EventEmitter()
  var timer
  var once

  if (!freq) freq = 2000

  function poll () {
    action(function (err, res) {
      if (err) return emitter.emit('error', err)

      emitter.emit('data', res)
    })
    timer = setTimeout(poll, freq)
  }

  emitter.on('newListener', function (event, listener) {
    if (!once && event === 'data') {
      once = true
      poll()

      emitter.on('removeListener', function (event, listener) {
        if (emitter.listenerCount('data') === 0) {
          clearTimeout(timer)
          once = false
        }
      })
    }
  })

  return emitter
}
