# Angular QuickStart Source

*Extended from the excellent [angular/quickstart](http://github/angular/quickstart) - October 13, 2016*

This folder extends the [angular/quickstart](http://github/angular/quickstart) by providing a way to produced an "ahead-of-time" compiled version, which is then integrated into a docker image with mongo and [restheart](http://restheart.org). The restheart server is used both for serving static assets (undertow) and for providing a secured REST api to the mongo db. The restheart server **can be customized** by adding custom application logic handlers, for instance.

During developement phase, jit "compilation" is still available, and you can see what you are doing on the lite-server. You may need to run aot once before you can run jit, since tsc will complain about aot specific ts files.

## Installation and usage

Installation

* `git clone` this repo,
* `npm install` to install client stuff
* `mvn clean package` to compile restheart custom server

Typical usage

* `npm aot-run` to compile (aot) and run dummy app
* `npm start` same, with jit version
* `npm run docker-run` to build and then run a dedicated docker image

Then remove *.git/* forlder and run `git init` to create a new repo - do not push application specific files into this one.




### available npm scripts

General purpose scripts :

* `npm start` - runs the compiler and the lite-server at the same time, both in "watch mode".
* `npm run tsc` - runs the TypeScript compiler once.
* `npm run tsc:w` - runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them.
* `npm run lite` - runs the [lite-server](https://www.npmjs.com/package/lite-server), a light-weight, static file server, written and maintained by
[John Papa](https://github.com/johnpapa) and
[Christopher Martin](https://github.com/cgmartin)
with excellent support for Angular apps that use routing.
* `npm run typings` - runs the typings tool.
* `npm run postinstall` - called by *npm* automatically *after* it successfully completes package installation. This script installs the TypeScript definition files this app requires.

Here are the test related scripts:
* `npm test` - compiles, runs and watches the karma unit tests
* `npm run e2e` - run protractor e2e tests, written in JavaScript (e2e-spec.js)

These are the "ahead-of-time" comilation scripts :
* `npm run aot-run` - compile "ahead-of-time"(aot) and run the compiled js code.
* `npm run aot` - just compile "ahead-of-time"(aot).

Docker related scripts - you rae responsible for ensuring restheart.jar has been built correctly beforehand. Also, remember to `git submodule update --init --recursive` to pull the browser submodule if you plan on using it.

* `npm run docker-run` - aot comile, make docker image and launch it. You can then connect to *https://localhost* to test it. You can also use *https://localhost/browser* to navigate the API.
* `npm run docker-build` - aot compile and make docker image

**CAUTION** : When compiling aot or jit, the above scripts copy index.html either from index-aot.html or from index-jit.html.
**Do not modify index.html** directly, or it will be overwritten.

## Building a docker image

The docker image is built directly from centos:7.

When customizing, please note that :

* the *dist/* folder is copied, as well as *etc/* and *mongoscripts/*
* the *node_modules/* is **not** available to docker. Make sure you copy the relevant needed imports
in the *dist/* folder, by modifying the *copy_modules.sh* utility file first.
* the restheart server is serving both the application and the API from the **https** internal port 4443. Route to external port as needed, typically 443 for https access. By default, it uses a self signed certificate, that requires browser to accept security exception.


## Testing

The QuickStart documentation doesn't discuss testing.
This repo adds both karma/jasmine unit test and protractor end-to-end testing support.

These tools are configured for specific conventions described below.

*It is unwise and rarely possible to run the application, the unit tests, and the e2e tests at the same time.
We recommend that you shut down one before starting another.*

### Unit Tests
TypeScript unit-tests are usually in the `app` folder. Their filenames must end in `.spec`.

Look for the example `app/app.component.spec.ts`.
Add more `.spec.ts` files as you wish; we configured karma to find them.

Run it with `npm test`

That command first compiles the application, then simultaneously re-compiles and runs the karma test-runner.
Both the compiler and the karma watch for (different) file changes.

Shut it down manually with Ctrl-C.

Test-runner output appears in the terminal window.
We can update our app and our tests in real-time, keeping a weather eye on the console for broken tests.
Karma is occasionally confused and it is often necessary to shut down its browser or even shut the command down (Ctrl-C) and
restart it. No worries; it's pretty quick.

### End-to-end (E2E) Tests

E2E tests are in the `e2e` directory, side by side with the `app` folder.
Their filenames must end in `.e2e-spec.ts`.

Look for the example `e2e/app.e2e-spec.ts`.
Add more `.e2e-spec.js` files as you wish (although one usually suffices for small projects);
we configured protractor to find them.

Thereafter, run them with `npm run e2e`.

That command first compiles, then simultaneously starts the Http-Server at `localhost:8080`
and launches protractor.  

The pass/fail test results appear at the bottom of the terminal window.
A custom reporter (see `protractor.config.js`) generates a  `./_test-output/protractor-results.txt` file
which is easier to read; this file is excluded from source control.

Shut it down manually with Ctrl-C.
