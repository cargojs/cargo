# Cargo

Git flow your development and deployment projects

Cargo is a collection of commands used to manage an infrastructure using
a git-flow style workflow.

## Installation

Cargo can be installed using the following commands

````
git clone https://github.com/cargojs/cargo.git ~/.cargo && \
cd ~/.cargo && \
npm install && \
cd
````

## Project Configuration

To use cargo you will need to create a project folder and put a file
'cargo.config' inside. The config file might look like the following
taken from `examples/grav/cargo.config`

````yaml
name: grav
repositories:
    grav:
        uri: 'https://github.com/getgrav/grav.git'
        setup: './bin/grav install'
services:
    www:
        image: 'docker/php:apache'
        maps:
            - 'grav:/var/www/html'
metal:
    development:
        driver: virtualbox

````

You will need to set up a machine to run your service containers (currently
boot2docker machine on virtualbox is supported) to do this run the following:

````
cargo metal provision development
````

This will create a docker-machine instance called grav.development
([name].[metal]). Now you have a machine you can initialise your repositories
using:

````
cargo init -
````

This will pull all the repositories listed in your configuration and run
any setup commands given (these are run from the repo directory)

## Commands

### cargo

````

  Usage: cargo [options] [command]


  Commands:


    init             Initialise the nearest cargo configuration
    clone <repo...>  Clone and pull any repositories including development and master branches
    setup <repo...>  Run the setup scripts for each repository
    config           Show the config information that would be used for any commands
    help [cmd]       display help for [cmd]

  Git flow your development and deployment projects

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### cargo init

````

  Usage: cargo-init [options] <repo...>

  Initialise the nearest cargo configuration

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### cargo clone

````

  Usage: cargo-clone [options] <repo...>

  Will clone all or particular repositories (paralell operation)

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### cargo setup

````

  Usage: cargo-setup [options] <repo...>

  Runs setup tasks for all or particular repositories (paralell operation)

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### cargo metal

````

  Usage: cargo-metal [options] <action> [metal...]

  Manage your infrastructure's metal, provision based on metal configuration (no wildcarding)

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### cargo path

````

  Usage: cargo-path [options]

  Show the cargo installation path from this project

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````
