# restheart-angular

## What is this repository

This is a "quick-start" project to build 3-tier applications, based on **angular2** on the client side, and calling the **restheart** server for api and custom backend services, which in turn relies on a **mongo** database.

The whole architecture is designed to run in docker containers. In this configuration, the Angular2 client is compiled "ahead-of-time", "tree-shaked", and minified.

However, during developement, the client can also be run locally, with jit compilation,
interacting with the backend containers, and updated in realtime in the browser.

Restheart can be customized to backend capabilities.

## Security

The client is only serving non secure, static files.
All security is handled via Resthart, accessible only via https calls.

## How to use it 

### Requirements

* node installed globally, or preferably nvm using a "stable" version of node,
* java jdk8 and maven installed,
* docker installed and running

### Make and install

`cd restheart-angular`
`./makeAll.sh && ./runAll.sh`

### Verify

`docker volume ls`
`docker network ls`
`docker ps`


You should see 3 containers running : mongo, restheart and client.
* mongo is not accesssible to the outside world, accessible via the created MYBRIDGE network
* restheart is open to the world via https on port 443(default). It comminicates with mongo via MYBRIDGE.
* client is open to the world on port 80. It will send api requests to resheart via https on port 443.

There is a data volume, `data`, that keeps all the database content.
The MYBRIDGE network is a custom bridge network between mongo and restheart.

