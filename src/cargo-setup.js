var shell = require('shelljs');
var async = require('async');
var _ = require('lodash');

var CargoSetup = function () {
    var scope = this;
    return function (cargo) {
        scope.cargo = cargo;
        return scope;
    }
};

CargoSetup.prototype.run = function (repos, callback) {
    var functions = [];
    if (repos[0] == '-') {
        repos = _.keys(this.cargo.config.get('codebases'));
    }
    _.each(repos, function (repo_name) {
        var repo = this.cargo.config.get('codebases')[repo_name];
        var func = function (callback) {
            var scope = this;
            var src = repo.uri;
            var dest = this.cargo.config.get('path') + '/repos/' + repo_name;

            this.cargo.log('Setting up', repo_name);
            shell.exec('cd ' + dest + ' && ' + repo.setup, {sync: true}, function (code) {
                if (code == 0) {
                    scope.cargo.log('Finished setting up', repo_name);
                    callback()
                } else {
                    callback()
                }
            });
        }
        functions.push(func.bind(this));
    }, this);


    async.parallel(
        functions,
        function(err, results){
            if (_.isFunction(callback)) callback();
        }
    );
};

module.exports = new CargoSetup;
