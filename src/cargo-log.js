var colors = require('colors');

var CargoLog = function () {
    var scope = this;
    this.verbose = false;
    return function (cargo) {
        scope.cargo = cargo;
        return scope.log;
    };
};

/**
 * Log to the console
 * @return null
 */
CargoLog.prototype.log = function () {
    var args = Array.prototype.slice.call(arguments);
    var color = 'blue';

    if (['log', 'error', 'throw'].indexOf(args[0]) != -1) {
        var type = args.shift();
        switch (type) {
            case 'error':
                color = 'yellow';
                break;
            case 'throw':
                color = 'red';
                break;
        }
    }
    args.unshift(colors[color]('[cargo]'));
    // if (this.verbose)
    console.log.apply(this, args);
};

/**
 * Log an error to the console
 * @return null
 */
CargoLog.prototype.error = function () {
    var text = Array.prototype.slice.call(arguments);
    text.unshift('error');
    this.log.apply(this, text);
};

/**
 * Throw an error with the given message and halt execution
 * @return null
 */
CargoLog.prototype.throw = function () {
    var text = Array.prototype.slice.call(arguments);
    text.unshift('throw');
    this.log.apply(this, text);
    process.exit(1);
};

module.exports = new CargoLog;
