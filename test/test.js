var fs = require('fs')
var test = require('tape')
var servertest = require('servertest')

var server = require('../server')

test('test server', function(t) {
  var series = Date.now()
  var path = ['', 'upload', series, 1].join('/')
  var opts = {method: 'POST', encoding: 'utf8'}
  var stream = servertest(server(), path, opts, function(err, res) {
    t.ifError(err, 'no error')
    t.equal(res.statusCode, 200, 'correct statusCode')
    t.equal(res.body, 'OK', 'correct body content')
    t.end()
  })

  var rs = fs.createReadStream(__dirname + '/test.png', {encoding: 'base64'})
  rs.pipe(stream)
})
