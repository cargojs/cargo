#!/usr/bin/env node

var pkg = require(__dirname + '/package.json');

var colors = require('colors');
var fs = require('fs');
var _ = require('lodash');

var cargo = require('./src/libs');;
var argv = require('minimist')(process.argv.slice(2));

// console.log(colors.blue(fs.readFileSync(__dirname + '/resources/art/logo-text')));


var available_commands = {
  init: function (args) {
    // Perform validation here
    if (args.length > 1) throw new Error(colors.red("[cargo]") + " cannot init more than one metal at a time.");

    return function () {
      // Trigger api actions here
      console.log(colors.green("[cargo]"), "initializing the current cargo project on", args.join());

    }
  },
  feature: {
    start: function (args) {
      return function () {
        var feature_name = args[0];
        var feature_parent = args[1];
        console.log(colors.green("[cargo]"), "starting a new feature:", feature_name, "from:", feature_parent);
        // console.log(_.omit(argv, '_'));
      }
    }
  },
  help: function (args) {
    return function () {
      console.log(args);
    }
  }
};

var command = cargo.util.commandResolve(argv._, available_commands);

if (_.isFunction(command)) {
  command();
} else {
  console.log(colors.red("[cargo]"), "could not find the command you entered, please try cargo help [command]");//, commands, command);
}
