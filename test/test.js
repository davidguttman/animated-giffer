var fs = require('fs')
var test = require('tape')
var servertest = require('servertest')

var server = require('../server')

var imgDir = '/tmp/animated-giffer/'

test('test server', function(t) {
  var series = Date.now()
  var seq = 1
  var path = ['', 'upload', series, seq].join('/')
  var opts = {method: 'POST', encoding: 'utf8'}

  var stream = servertest(server(), path, opts, function(err, res) {
    t.ifError(err, 'no error')
    t.equal(res.statusCode, 200, 'correct statusCode')
    t.equal(res.body, 'OK', 'correct body content')

    var seqStr = '0000' + seq
    var expectedPath = imgDir + series + '/' + seqStr + '.png'
    fs.exists(expectedPath, function(exists) {
      t.ok(exists, 'file should exist')
      t.end()
    })

  })

  var rs = fs.createReadStream(__dirname + '/test.png', {encoding: 'base64'})
  rs.pipe(stream)
})
