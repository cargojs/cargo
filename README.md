# Cargo

Git flow your development and deployment projects

Cargo is a collection of commands used to manage an infrastructure using
a git-flow style workflow.

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

  Manage your infrastructure's metal, provision based on metal configuration

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````
