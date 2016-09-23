Array.prototype.last = function() {
    return this[this.length-1];
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {}
