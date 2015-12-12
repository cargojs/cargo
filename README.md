# Cargo

_Approach everything with a flow_

Cargo is an approach to development and deployment that follows the git flow
approach to branching and version management.

## Key Concepts

Cargo relies heavily on git, git flow, docker, docker-compose, and
docker-machine. Thanks to these great projects we can apply the ideas behind
Vincent Driessen's [branching model](http://nvie.com/git-model)

#### Metal

Metal is the equivilent of docker-machine but abstracted to allow easier
management of deployments from your development environment.

#### Service

A service is a containerized daemon or tool that is deployed to your metal.
Services could be web servers, applications like php cli, or mysql.

#### Codebase

A codebase is a git repository of files to be mapped or copied to your services
they are usually mapped when used on a development or staging metal and copied
when building a production service.

## Configuring Cargo

A cargo project is configured using a yaml file in the root of your cargo
project. This file should describe everything that is needed to set up your
project, including your servers, services, and codebases.

__cargo.yml__ file

```yaml
name: grav
defaults:
  metal: development
codebases:
  grav:
    uri: 'https://github.com/getgrav/grav.git'
    setup: ./bin/grav install
services:
  www:
    image: 'docker/php:apache'
    volumes:
      - 'grav:/var/www/html'
metal:
  development:
    driver: virtualbox
  staging:
    driver: generic
    ip-address: 10.0.100.15
    ssh-key: ~/.ssh/id_rsa
    ssh-user: deployer
    ssh-port: 22
  production:
    driver: auth.digitalocean
```
