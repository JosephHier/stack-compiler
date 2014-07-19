function OutputStream () {
  this._contents = '';
}

OutputStream.prototype.write = function write (str) {
  this._contents += str;
};

OutputStream.prototype.writeLine = function writeLine (str) {
  this._contents += str + '\n';
};

OutputStream.prototype.writeLines = function writeLine (strArr) {
  this._contents += strArr.join('\n') + '\n';
};

OutputStream.prototype.getContents = function getContents () {
  return this._contents;
};

module.exports = OutputStream;
