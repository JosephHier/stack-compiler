var CommandType = require('./CommandType.js');
var Parser = require('./Parser.js');
var Stream = require('./Stream.js');

var stream = new Stream([
  'push constant 3',
  'push constant 2',
  'add'
].join('\n'));
var parser = new Parser(stream);
while (parser.hasMoreCommands()) {
  parser.advance();
  console.log(CommandType.toString(parser.commandType()));
}
