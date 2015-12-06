var shell = require('shelljs');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var YAML = require('yamljs');

var CargoService = function () {
    var scope = this;
    return function (cargo) {
        scope.cargo = cargo;
        return scope;
    }
};

CargoService.prototype.status = function (services, metals, callback) {
    var scope = this;
    if (metals == '-') {
        metals = _.keys(this.cargo.config.get('metal'));
    } else {
        metals = [metals];
    }

    shell.exec('docker-machine ls', {silent: true}, function (err, output) {
        var regex_string = '^((cargo';

        _.each(metals, function (metal, metal_name) {
            regex_string += '|' + scope.cargo.config.get('name') + '.' + metal;
        });

        regex_string += ')[^\n]+)$';

        var regex = new RegExp(regex_string, "gm");
        var metal_status = output.match(regex);

        callback(metal_status.join('\n'));
    });
};

CargoService.prototype.provision = function (services, metals, callback) {
    var metal_functions = [];
    if (metals == '-') {
        metals = _.keys(this.cargo.config.get('metal'));
    } else {
        metals = [metals];
    }

    if (services[0] == '-') {
        services = _.keys(this.cargo.config.get('services'));
    }

    // Remove all the files accosiated with services
    shell.rm('-rf', this.cargo.config.get('path') + '/.cargo/compose');

    _.each(metals, function (metal_name) {
        var service_functions = [];
        if (_.keys(this.cargo.config.get('metal')).indexOf(metal_name) == -1) {
            this.cargo.log('throw', metal_name, 'does not exist in your config');
        }
        var metal = this.cargo.config.get('metal')[metal_name];
        var func = function (callback) {
            var scope = this;
            var image = metal.image;
            metal_name = this.cargo.config.get('name') + '.' + metal_name;

            this.cargo.log('Provisioning services', services.join(', '), 'on', metal_name);

            _.each(services, function (service_name) {

                var func = function (callback) {
                    if (_.keys(this.cargo.config.get('services')).indexOf(service_name) == -1) {
                        this.cargo.log('throw', service_name, 'does not exist in your config');
                    }
                    this.cargo.log('Provisioning', service_name);
                    var service = this.cargo.config.get('services')[service_name];

                    this.cargo.log('Obtaining image for', service.image);
                    if (service.image.indexOf('docker/') != -1) {
                        shell.exec(
                            'eval "$(docker-machine env ' + metal_name + ')" && ' +
                            'docker pull ' + service.image.replace('docker/', ''),
                            {silent: true}
                        );
                    }
                    if (service.image.indexOf('local/') != -1) {
                        shell.exec(
                            'eval "$(docker-machine env ' + metal_name + ')" && ' +
                            'cd ' + this.cargo.config.get('path') + service.image.replace('local/', '/images/') + ' && ' +
                            'docker build -t ' + service.image.replace('local/', '') + ' .'
                        );
                    }

                    this.cargo.log('Writing docker-compose file to disk for', service_name);

                    var compose = {};
                    compose[service_name] = {
                        image: service.image.replace('docker/', '').replace('local/', '') ,
                        volumes: [
                            this.cargo.config.get('path') + "/repos/grav" + ":/var/www/html"
                        ],
                        ports: service.ports
                    };

                    shell.mkdir('-p', this.cargo.config.get('path') + '/.cargo/compose/');
                    fs.appendFile(this.cargo.config.get('path') + '/.cargo/compose/' + metal_name + '.yml', YAML.stringify(compose, 4), function (err) {
                        // console.log('docker-compose up -d -f ' + scope.cargo.config.get('path') + '/.cargo/compose/' + metal_name + '.yml');process.exit();
                        shell.exec(
                            'eval "$(docker-machine env ' + metal_name + ')" && ' +
                            'cd ' + scope.cargo.config.get('path') + ' && ' +
                            'docker-compose -p ' + scope.cargo.config.get('name') + ' -f ' + scope.cargo.config.get('path') + '/.cargo/compose/' + metal_name + '.yml up -d',
                            {async: true},
                            function () {
                                shell.exec(
                                    'eval "$(docker-machine env ' + metal_name + ')" && ' +
                                    'docker-machine ip ' + metal_name,
                                    {async: true, silent: true},
                                    function (err, metal_ip) {
                                        scope.cargo.log('Service running: http://' + metal_ip + '/');
                                        callback();
                                    }
                                )
                            }
                        );
                    });
                };
                service_functions.push(func.bind(this));
            }, this);

            async.parallel(
                service_functions,
                function(err, results){

                    if (_.isFunction(callback)) callback();
                }
            );
        };
        metal_functions.push(func.bind(this));
    }, this);

    shell.exec('docker-machine ls', {silent: true}, function (err, output) {
        metal_running = output.match(/^(?!NAME)([0-9a-zA-Z\-\.]+)/gm);

        async.parallel(
            metal_functions,
            function(err, results){
                if (_.isFunction(callback)) callback();
            }
        );
    });

};

module.exports = new CargoService;
