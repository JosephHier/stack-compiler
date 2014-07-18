function CodeWriter (stream) {
  this._stream = stream;
  this._files = {};
  this._currentFileName = null;
  this._currentFile = null;
}

CodeWriter.prototype.setFileName = function setFileName (fileName) {
  this._currentFileName = fileName;
  this._files[this._currentFileName] = '';
  this._currentFile = this._files[this._currentFileName];
};

CodeWriter.prototype.writeArithmetic = function writeArithmetic (command) {};

CodeWriter.prototype.writePushPop = function writePushPop (command, segment,
    index) {
};

CodeWriter.prototype.close = function close () {};

module.exports = CodeWriter;
