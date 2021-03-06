var shell = require('shelljs');
var async = require('async');
var _ = require('lodash');

var CargoMetal = function () {
    var scope = this;
    return function (cargo) {
        scope.cargo = cargo;
        return scope;
    }
};

CargoMetal.prototype.status = function (metals, callback) {
    var scope = this;
    metals = [metals];
    if (metals[0] == '-') {
        metals = _.keys(this.cargo.config.get('metal'));
    }

    this.cargo.log('Getting status on', metals.join(','));

    shell.exec('docker-machine ls', {silent: true}, function (err, output) {
        var regex_string = '^((NAME';

        _.each(metals, function (metal, metal_name) {
            regex_string += '|' + scope.cargo.config.get('name') + '.' + metal;
        });

        regex_string += ')[^\n]+)$';

        var regex = new RegExp(regex_string, "gm");
        var metal_status = output.match(regex);

        scope.cargo.log('Finished getting status on', metals.join(', '));

        callback(metal_status.join('\n'));
    });
};

CargoMetal.prototype.provision = function (metals, callback) {
    var functions = [];

    _.each(metals, function (metal_name) {
        if (_.keys(this.cargo.config.get('metal')).indexOf(metal_name) == -1) {
            this.cargo.log('throw', metal_name, 'does not exist in your config');
        }
        var metal = this.cargo.config.get('metal')[metal_name];
        var func = function (callback) {
            var scope = this;
            var image = metal.image;
            var docker_machine_command = 'docker-machine create ';

            metal_name = this.cargo.config.get('name') + '.' + metal_name;

            this.cargo.log('Provisioning', metal_name);

            if (metal_running.indexOf(metal_name) != -1) {
                this.cargo.log('Metal already running, run cargo metal destroy', metal_name, 'if you want to start again');
                return callback();
            }

            docker_machine_command += '--driver ' + metal.driver + ' ';

            docker_machine_command += metal_name;

            shell.exec(docker_machine_command, {async: true}, function () {
                scope.cargo.log('Metal', metal_name, 'has been provisioned');
                return callback();
            });
        }
        functions.push(func.bind(this));
    }, this);

    shell.exec('docker-machine ls', {silent: true}, function (err, output) {
        metal_running = output.match(/^(?!NAME)([0-9a-zA-Z\-\.]+)/gm);

        async.parallel(
            functions,
            function(err, results){
                if (_.isFunction(callback)) callback();
            }
        );
    });

};

module.exports = new CargoMetal;
