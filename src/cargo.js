require('shelljs/global');
var fs = require('fs');
/**
 * Git flow your entire development workflow
 * @class Cargo
 */
var Cargo = function () {
    this.checkRequirements();
    this.log = require('./cargo-log')(this);
    this.config = require('./cargo-config')(this);
    this.git = require('./cargo-git')(this);
    this.setup = require('./cargo-setup')(this);

};

/**
 * Storage for cargo setup
 * @type {Object}
 */
Cargo.prototype.setup = {};

/**
 * Storage for cargo config from cargo.config file
 * @type {Object}
 */
Cargo.prototype.config = {};

/**
 * Check that all the requirements for starting docker are met
 * @return null
 */
Cargo.prototype.checkRequirements = function () {
    var scope = this;
    exec('docker-machine ls', {silent: true}, function (err, output) {
        scope.setup.metals = /^(?!NAME)([0-9a-zA-Z\-\.]+)/gm;
    });
    if (!which('git')) {
        this.log('throw', 'Sorry, this script requires git');
    }
    if (!which('git-flow')) {
        this.log('throw', 'Sorry, this script requires git flow');
    }
    if (!which('docker') || !which('docker-compose') || !which('docker-machine')) {
        this.log('throw', 'Sorry, this script requires docker');
    }
};

/**
 * Exports Cargo
 * @type {Cargo}
 */
module.exports = Cargo;
