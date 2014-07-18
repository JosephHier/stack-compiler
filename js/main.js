var Stream = require('./Stream.js');
var Parser = require('./Parser.js');

var stream = new Stream([
	'push constant 3',
	'push constant 2',
	'add'
].join('\n'));
var parser = new Parser(stream);
while (parser.hasMoreCommands()) {
	parser.advance();
	console.log(parser.commandType());
}
