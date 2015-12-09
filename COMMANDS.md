# Cargo Command Reference

## Staring Out

Go through the setup wizard to get your cargo.

```
cargo config wizard
```

Or to get started you can just add the following as a cargo.yml
file in the root of your project directory.

```yaml
name: grav
defaults:
  metal: development
codebases:
    grav:
        uri: 'https://github.com/getgrav/grav.git'
        setup: './bin/grav install'
services:
    www:
      image: 'docker/php:apache'
      volumes:
        - 'grav:/var/www/html' # Map a codebase or folder
metal:
  development:
    driver: virtualbox
  staging:
    driver: generic
    ip-address: 10.0.100.15
    ssh-key: ~/.ssh/id_rsa
    ssh-user: deployer
    ssh-port: 22
  production: # Avoid listing production servers in this file (see below)
    driver: digitalocean
    access-token: aa9399a2175a93b17b1c86c80
```

## First steps

Now the cargo project needs to be initialized into a metal environment before
any work can be done.

```
cargo init <metal>
```

Where metal is an environment given in the configuration file or blank for the
default metal.

The idea behind the init command is to leave you with a fully working
environment to work on your codebases.
