function InputStream (str) {
  this.str = str;
  this.index = 0;
}

InputStream.prototype.get = function get () {
  return this.str.charAt(this.index++);
};

InputStream.prototype.peek = function peek () {
  return this.str.charAt(this.index);
};

InputStream.prototype.unget = function unget () {
  this.index--;
};

module.exports = InputStream;
