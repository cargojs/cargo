var _ = require('lodash');
var Util = function () {

};

Util.prototype.commandResolve = function(path, obj) {
  var func, args;
  _.each(path, function (val, key) {
    console.log(path.slice(0, key));
    func = this.functionResolve(path.slice(0, key), obj, true);
    if (_.isFunction(func)) {
      args = path.slice(key);
      return false;
    }
  }, this);
  console.log(func)
  return func(args); //_.isFunction(func) ? func(args) : undefined;
};

Util.prototype.functionResolve =  function(path, obj, safe) {
    return path.reduce(function(prev, curr) {
        return !safe ? prev[curr] : (prev ? prev[curr] : undefined)
    }, obj || this)
};

module.exports = new Util;
