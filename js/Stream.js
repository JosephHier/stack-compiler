function Stream (str) {
  this.str = str;
  this.index = 0;
}

Stream.prototype.get = function get () {
  return this.str.charAt(this.index++);
};

Stream.prototype.peek = function peek () {
  return this.str.charAt(this.index);
};

Stream.prototype.unget = function unget () {
  this.index--;
};

module.exports = Stream;
