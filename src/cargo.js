require('shelljs/global');
var fs = require('fs');
var shell = require('shelljs');

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
    this.metal = require('./cargo-metal')(this);
    this.service = require('./cargo-service')(this);

    // Create the local cargo folder if we have a config path
    if (this.config.get('path')) {
        shell.mkdir('-p', this.config.get('path') + '/.cargo');
    }
};

/**
 * Check that all the requirements for starting docker are met
 * @return null
 */
Cargo.prototype.checkRequirements = function () {
    var scope = this;

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
