var shell = require('shelljs');
var async = require('async');
var _ = require('lodash');

var CargoGit = function () {
    var scope = this;
    return function (cargo) {
        scope.cargo = cargo;
        return scope;
    }
};

CargoGit.prototype.clone = function (repos, callback) {
    var functions = [];
    if (repos[0] == '-') {
        repos = _.keys(this.cargo.config.get('repositories'));
    }

    _.each(repos, function (repo_name) {
        var repo = this.cargo.config.get('repositories')[repo_name];
        var func = function (callback) {
            var scope = this;
            var src = repo.uri;
            var dest = this.cargo.config.get('path') + '/repos/' + repo_name;

            shell.mkdir('-p', dest);
            this.cargo.log('Cloning', repo_name);
            shell.exec('git clone ' + src + ' ' + dest, {silent: true, async: true}, function (code) {
                switch (code) {
                    case 0:
                        scope.cargo.log('Finished cloning', repo_name);
                        scope.cargo.log('Setting up git flow for', repo_name);
                        shell.exec('cd ' + dest + ' && git branch master origin/master', {silent: true, async: true}, function () {
                            shell.exec('cd ' + dest + ' && git flow init -d', {silent: true, async: true}, function () {
                                scope.cargo.log('Finished setting up git flow', repo_name);
                                callback();
                            });
                        });
                        break;
                    case 128:
                        scope.cargo.log('error', 'Unable to clone', repo_name, '- folder not empty');
                        callback();
                        break;
                    default:
                        scope.cargo.log('error', 'Unable to clone', repo_name);
                        callback();
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

module.exports = new CargoGit;
