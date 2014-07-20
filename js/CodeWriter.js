var CommandType = require('./CommandType.js');

function CodeWriter (outStream) {
  this._outStream = outStream;
  this._fileName = null;
  this._label = 0;
}

CodeWriter.prototype.setFileName = function setFileName (fileName) {
  this._fileName = fileName;
};

CodeWriter.prototype.writeArithmetic = function writeArithmetic (command) {
  switch (command) {
  case 'add':
    this._writeBinaryOp('+');
    break;
  case 'sub':
    this._writeBinaryOp('-');
    break;
  case 'and':
    this._writeBinaryOp('&');
    break;
  case 'or':
    this._writeBinaryOp('|');
    break;
  case 'eq':
    this._writeBooleanOp('EQ');
    break;
  case 'gt':
    this._writeBooleanOp('GT');
    break;
  case 'lt':
    this._writeBooleanOp('LT');
    break;
  case 'neg':
    this._writeUnaryOp('-');
    break;
  case 'not':
    this._writeUnaryOp('!');
    break;
  default:
    throw new Error('Invalid arithmetic command');
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
    break;
  case 'static':
    this._writeStaticAddressToD(index);
    break;
  case 'constant':
    if (command === CommandType.C_POP) {
      throw new Error('Cannot pop to constant');
    }
    this._writePushConstantToStack(index);
    return;
  case 'pointer':
    this._writePointerAddressToD(index);
    break;
  case 'temp':
    this._writeTempAddressToD(index);
    break;
  default:
    throw new Error('Invalid segment');
  }

  if (command === CommandType.C_PUSH) {
    this._writeMoveHeadToD();
    this._writeMemoryToD();
    this._writePushDToStack();
  } else {
    this._writeStashD(13);
    this._writePopStackToD();
    this._writeRestoreD(13);
  }
};

CodeWriter.prototype.close = function close () {};

CodeWriter.prototype._writePushDToStack = function _writePushDToStack () {
  this._outStream.writeLines([
    '@SP',
    'A=M',
    'M=D',
    '@SP',
    'M=M+1'
  ]);
};

CodeWriter.prototype._writePopStackToD = function _writePopStackToD () {
  this._outStream.writeLines([
    '@SP',
    'M=M-1',
    'A=M',
    'D=M'
  ]);
};

CodeWriter.prototype._writeMoveHeadToD = function _writeMoveHeadToD () {
  this._outStream.writeLine('A=D');
};

CodeWriter.prototype._writeMemoryToD = function _writeMemoryToD () {
  this._outStream.writeLine('D=M');
};

CodeWriter.prototype._writeStashD = function _writeStashD (address) {
  this._outStream.writeLines([
    '@' + address,
    'M=D'
  ]);
};

CodeWriter.prototype._writeRestoreD = function _writeRestoreD (address) {
  this._outStream.writeLines([
    '@' + address,
    'A=M',
    'M=D'
  ]);
};

CodeWriter.prototype._writeSegmentAddressToD =
    function _writeSegmentAddressToD (segment, index) {
  var label = this._segmentLabel(segment);
  this._outStream.writeLine('@' + label);
  if (index === 0) {
    this._outStream.writeLine('D=M');
  } else {
    this._outStream.writeLines([
      '@' + index,
      'D=D+A'
    ]);
  }
};

CodeWriter.prototype._writePushConstantToStack =
    function _writePushConstantToStack (number) {
  this._outStream.writeLines([
    '@' + number,
    'D=A'
  ]);
  this._writePushDToStack();
};

CodeWriter.prototype._writeStaticAddressToD =
    function _writeStaticAddressToD (index) {
  var label = this._fileName + '.' + index;
  this._outStream.writeLines([
    '@' + label,
    'D=A'
  ]);
};

CodeWriter.prototype._writePointerAddressToD =
    function _writePointerAddressToD (index) {
  if (index === 0) {
    this._outStream.writeLines([
      '@THIS',
      'D=A'
    ]);
  } else if (index === 1) {
    this._outStream.writeLines([
      '@THAT',
      'D=A'
    ]);
  } else {
    throw new Error('Invalid index for pointer segment: ' + index);
  }
};

CodeWriter.prototype._writeTempAddressToD =
    function _writeTempAddressToD (index) {
  if (index < 0 || index > 7) {
    throw new Error('Invalid index for temp segment: ' + index);
  }

  this._outStream.writeLines([
    '@' + 5 + index,
    'D=A'
  ]);
};

CodeWriter.prototype._writeBinaryOp = function _writeBinaryOp (op) {
  this._writePopStackToD();
  this._writeStashD(14);
  this._writePopStackToD();
  this._outStream.writeLines([
    '@14',
    'D=D' + op + 'M'
  ]);
  this._writePushDToStack();
};

CodeWriter.prototype._writeUnaryOp = function _writeUnaryOp (op) {
  this._writePopStackToD();
  this._outStream.writeLine('D=' + op + 'D');
  this._writePushDToStack();
};

CodeWriter.prototype._writeBooleanOp = function _writeBooleanOp (op) {
  var labelNum = this._label++;
  var trueLabel = 'TRUE' + labelNum;
  var endLabel = 'END' + labelNum;
  this._writePopStackToD();
  this._writeStashD(14);
  this._writePopStackToD();
  this._outStream.writeLines([
    '@14',
    'D=D-M',
    '@' + trueLabel,
    'D;J' + op,
    'D=0',
    '@' + endLabel,
    '0;JMP',
    '(' + trueLabel + ')',
    'D=-1',
    '(' + endLabel + ')'
  ]);
  this._writePushDToStack();
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
