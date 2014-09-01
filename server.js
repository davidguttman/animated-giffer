var http = require('http')
var fs = require('fs')
var cors = require('corsify')
var mkdirp = require('mkdirp')

var pad = require('./pad.js')

var imgDir = '/tmp/animated-giffer'

var createServer = module.exports = function() {
  return http.createServer(cors(function(req, res) {
    var routeParts = req.url.split('/')
    if (routeParts[1] === 'upload') {
      req.params = {series: routeParts[2], seq: routeParts[3]}
      return upload(req, res)
    }

    if (routeParts[1] === 'create') {
      req.params = {series: routeParts[2]}
      return create(req, res)
    }

  }))
}

function upload (req, res) {
  var seq = req.params.seq
  var series = req.params.series

  var pSeq = pad(seq, 5)
  var dir = [imgDir, series].join('/')

  mkdirp(dir, function(err) {
    var imgPath = dir + '/' + pSeq + '.png'

    var buf = ''
    req.on('data', function(data) {buf += data})
    req.on('end', function() {

      fs.writeFile(imgPath, new Buffer(buf, 'base64'), function(err) {
        return res.end('OK')
      })

    })
  })
}

function create (req, res) {
  // convert -delay 1x30 `seq -f images/%04g.png 0 179` \
  //         -coalesce -layers OptimizeTransparency oren.gif
}

if (require.main === module) {
  var port = process.env.PORT || 3001
  server.listen(port)
  console.log('listening on port', port)
}
