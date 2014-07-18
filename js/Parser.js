var CommandType = require('./CommandType.js');

function Parser (stream) {
	this._stream = stream;
	this._command = null;
}

Parser.prototype.hasMoreCommands = function hasMoreCommands () {
	return this._stream.peek() === '';
};

Parser.prototype.advance = function advance () {
	this._command = '';
	var c = this._stream.get();
	while (c !== '\n' && c !== '') {
		this._command += c;
		c = this._stream.get();
	}
	this._command = this._command.trim();

	if (c !== '' && this._command.length === 0) {
		this.advance();
	}
};

Parser.prototype.commandType = function commandType () {
	var firstWord = this._command.split(' ')[0];
	switch (firstWord) {
	case 'push':
		return CommandType.C_PUSH;
	case 'pop':
		return CommandType.C_POP;
	case 'label':
		return CommandType.C_LABEL;
	case 'goto':
		return CommandType.C_GOTO;
	case 'if':
		return CommandType.C_IF;
	case 'function':
		return CommandType.C_FUNCTION;
	case 'return':
		return CommandType.C_RETURN;
	case 'call':
		return CommandType.C_CALL;
	case 'add':
	case 'sub':
	case 'neg':
	case 'eq':
	case 'gt':
	case 'lt':
	case 'and':
	case 'or':
	case 'not':
		return CommandType.C_ARITHMETIC;
	default: 
		throw new Error('Invalid command');
	}
};

Parser.prototype.arg1 = function arg1 () {
	var words = this._command.split(' ');
	if (this.commandType() === CommandType.C_ARITHMETIC) {
		return words[0];
	} else {
		return words[1];
	}
};

Parser.prototype.arg2 = function arg2 () {
	return parseInt(this._command.split(' ')[2]);
};

module.exports = Parser;
