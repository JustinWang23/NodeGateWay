var path = require('path');
var morgan = require('morgan');
var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');

var logDirectory = path.resolve(__dirname, '../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

var logger = morgan(':remote-addr - [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {stream: accessLogStream});

module.exports = logger;