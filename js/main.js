var CodeWriter = require('./CodeWriter.js');
var CommandType = require('./CommandType.js');
var Parser = require('./Parser.js');
var InputStream = require('./InputStream.js');
var OutputStream = require('./OutputStream.js');

var inStream = new InputStream([
  'push constant 3',
  'push constant 2',
  'add'
].join('\n'));
var asmFile = new OutputStream();
var codeWriter = new CodeWriter(asmFile);
codeWriter.setFileName('test');
var parser = new Parser(inStream);

while (parser.hasMoreCommands()) {
  parser.advance();

  var commandType = parser.commandType();
  if (commandType === CommandType.C_PUSH || commandType === CommandType.C_POP) {
    codeWriter.writePushPop(commandType, parser.arg1(), parser.arg2());
  } else {
    codeWriter.writeArithmetic(commandType);
  }
}

console.log(asmFile.getContents());
