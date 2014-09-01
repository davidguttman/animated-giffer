var fs = require('fs')
var http = require('http')
var cors = require('corsify')
var mkdirp = require('mkdirp')
var exec = require('child_process').exec

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
      var series = routeParts[2]
      var fps = routeParts[3] || '30'
      req.params = {series: series, fps: fps}
      console.log('create', req.params)
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
  var seriesDir = imgDir + '/' + req.params.series
  var outPath = seriesDir + '.gif'

  fs.readdir(seriesDir, function(err, files) {
    var iStart = 0
    var iEnd = files.length - 1

    var cmd = 'convert'
    cmd += ' -delay 1x' + req.params.fps
    cmd += ' `seq -f ' + seriesDir + '/%05g.png 0 ' + iEnd + '`'
    cmd += ' -coalesce'
    cmd += ' -layers OptimizeTransparency'
    cmd += ' ' + outPath

    console.log('Executing command:', cmd)

    exec(cmd, function(err, stdout, stderr) {
      if (err) return console.error(err)

      res.writeHead(200, {'Content-Type':'image/gif'})
      fs.createReadStream(outPath).pipe(res)
    })
  })

  // convert -delay 1x30 `seq -f images/%04g.png 0 179` \
  //         -coalesce -layers OptimizeTransparency oren.gif
}

if (require.main === module) {
  var port = process.env.PORT || 3001
  var server = createServer()
  server.listen(port)
  console.log('listening on port', port)
}
