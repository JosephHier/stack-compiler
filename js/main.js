var CodeWriter = require('./CodeWriter.js');
var CommandType = require('./CommandType.js');
var Parser = require('./Parser.js');
var InputStream = require('./InputStream.js');
var OutputStream = require('./OutputStream.js');

var inStream = new InputStream([
  'push constant 3',
  'push constant 2',
  'gt',
  'pop static 0',
  'push static 0',
  'not'
].join('\n'));

var parser = new Parser(inStream);
var asmFile = new OutputStream();
var codeWriter = new CodeWriter(asmFile);
codeWriter.setFileName('test');

while (parser.hasMoreCommands()) {
  parser.advance();

  var commandType = parser.commandType();
  if (commandType === CommandType.C_PUSH || commandType === CommandType.C_POP) {
    codeWriter.writePushPop(commandType, parser.arg1(), parser.arg2());
  } else if (commandType === CommandType.C_ARITHMETIC) {
    codeWriter.writeArithmetic(parser.arg1());
  } else {
    throw new Error('Invalid command type');
  }
}

$(function() {
  $('<p>', {
    html: asmFile.getContents().split('\n').join('<br />')
  }).appendTo('body');
});
