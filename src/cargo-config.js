var YAML = require('yamljs');
var _ = require('lodash');

var CargoConfig = function () {
    var scope = this;
    return function (cargo) {
        scope.cargo = cargo;
        scope.loadConfig();
        return scope;
    }
};

CargoConfig.prototype.get = function (property) {
    return _.propertyOf(_.extend(this._setup, this._config))(property);
};

CargoConfig.prototype.show = function (full) {
    var config = this._config;
    if (full) config = _.extend(config, this._setup);
    return YAML.stringify(config, 4);
};

/**
 * Get the configuration file for the current project,
 * if no config file is found then we restrict
 * available commands
 * @return null
 */
CargoConfig.prototype.loadConfig = function () {
    var scope = this;
    var path = process.cwd(), config = false;

    this._setup = YAML.load(__dirname + '/../cargo.setup');

    _.each(path.split('/'), function () {
        try {
            scope._config = YAML.load(path + '/cargo.config');
            process.chdir(path);
            return false;
        } catch (err) {
            path = path.substring(0, path.lastIndexOf('/'));
        }
    });

    this._setup.path = path;

    if (this._config) {
        this.cargo.log('Found config file in', path);
    } else {
        this.cargo.log('throw', 'Could not find config file');
    }
};

module.exports = new CargoConfig;
