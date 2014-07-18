var CommandType = require('./CommandType.js');

function CodeWriter (outStream) {
  this._outStream = outStream;
  this._fileName = null;
}

CodeWriter.prototype.setFileName = function setFileName (fileName) {
  this._fileName = fileName;
};

CodeWriter.prototype.writeArithmetic = function writeArithmetic (command) {
  switch (command) {
  case 'add':
    this._writeAdd();
    break;
  // TODO
  }
};

CodeWriter.prototype.writePushPop = function writePushPop (command, segment,
    index) {
  switch (segment) {
  case 'local':
  case 'argument':
  case 'this':
  case 'that':
    this._writeSegmentAddressToD(segment, index);
    if (command === CommandType.C_PUSH) {
      this._outStream.writeLines([
        'A=D',
        'D=M'
      ]);
      this._writePushD();
    } else {
      this._outStream.writeLines([
        '@13',
        'M=D'
      ]);
      this._writePopD();
      this._outStream.writeLines([
        '@13',
        'A=M',
        'M=D'
      ]);
    }
    break;
  }
};

CodeWriter.prototype.close = function close () {};

CodeWriter.prototype._writePushD = function _writePushD () {
  this._outStream.writeLine([
    '@SP',
    'A=M',
    'M=D',
    '@SP',
    'M=M+1'
  ]);
};

CodeWriter.prototype._writePopD = function _writePopD () {
  this._outStream.writeLines([
    '@SP',
    'M=M-1',
    'A=M',
    'D=M'
  ]);
};

CodeWriter.prototype._writeSegmentAddressToD =
    function _writeSegmentAddressToD (segment, index) {
  var label = this._segmentLabel(segment);
  this._outStream.writeLine('@' + label);
  if (index === 0) {
    this._outStream.writeLine('D=M');
  } else {
    this._outStream.writeLine([
      '@' + index,
      'D=D+A'
    ]);
  }
};

CodeWriter.prototype._writeAdd = function _writeAdd () {
  this.writePushPop(CommandType.C_POP, 'temp', 0);
  // TODO
};

CodeWriter.prototype._segmentLabel = function _segmentLabel (segment) {
  switch (segment) {
  case 'local':
    return 'LCL';
  case 'argument':
    return 'ARG';
  case 'this':
    return 'THIS';
  case 'that':
    return 'THAT';
  default:
    throw new Error('Invalid segment');
  }
};

module.exports = CodeWriter;
