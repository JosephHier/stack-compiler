var CommandType = require('./CommandType.js');
var Parser = require('./Parser.js');
var InputStream = require('./InputStream.js');

var inStream = new InputStream([
  'push constant 3',
  'push constant 2',
  'add'
].join('\n'));
var parser = new Parser(inStream);
while (parser.hasMoreCommands()) {
  parser.advance();
  console.log(CommandType.toString(parser.commandType()));
}
