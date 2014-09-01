var fs = require('fs')
var test = require('tape')
var servertest = require('servertest')

var server = require('../server')

var imgDir = '/tmp/animated-giffer/'

var series = Date.now()

test('upload', function(t) {
  var seq = 0
  var img = __dirname + '/test.png'

  sendImg(img, series, seq, function(err, res) {
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
})

test('add 2nd image', function(t) {
  var seq = 1
  var img = __dirname + '/test2.png'
  sendImg(img, series, seq, function(err, res) {
    t.ifError(err, 'no error')
    t.end()
  })
})

test('create', function(t) {
  var fps = 2
  var path = ['', 'create', series, fps].join('/')
  var opts = {method: 'GET', encoding: 'utf8'}

  servertest(server(), path, opts, function(err, res) {
    t.ifError(err, 'no error')
    t.equal(res.statusCode, 200, 'correct statusCode')
    t.equal(res.body, 'OK', 'correct body content')

    var expectedPath = imgDir + series + '.gif'
    fs.exists(expectedPath, function(exists) {
      t.ok(exists, 'file should exist')
      t.end()
    })

  })
})

function sendImg (img, series, seq, cb) {
  var path = ['', 'upload', series, seq].join('/')
  var opts = {method: 'POST', encoding: 'utf8'}

  var stream = servertest(server(), path, opts, cb)

  var rs = fs.createReadStream(img, {encoding: 'base64'})
  rs.pipe(stream)
}
