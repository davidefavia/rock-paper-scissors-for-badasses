![Badasses!](src/img/hero.png "Badasses!")

Choose your badass and play against computer!

## Requirements
To develop, serve and build this project you need `node.js` and `bower` and `gulp` installed globally.

```shell
$ npm install -g bower
$ npm install -g gulp
```

To run tests you also need `karma-cli` installed globally:

```shell
$ npm install -g karma-cli
```

## Installation

Install `node.js` modules and `bower` dependencies:

```shell
$ npm install
$ bower install
```

## Develop while playing

Run task:

```shell
$ gulp serve
```

This task creates a folder named `build` inside the project, it is removed and created when you run `serve`. If you open your browser at [http://localhost:12345](http://localhost:12345) you can play the game.

If you need to make changes or fix bugs, just modify files inside `src` folder: every change is reflected inside `build` folder and the game is reloaded inside the browser.

### Javascript

Main application file is located at `src/js/app.js`. It describes the **AngularJS** application of the game.

### Styles

**Bootstrap** is the chosen frontend package. For simpliciy you can override **Bootstrap** styles inside `src/less/app.less` file, it is compiled down to CSS at every change and moved to `build/css` folder.

## Build

To build and distribute project:

```shell
$ gulp dist
```

This task works like `serve` BUT it does not start the webserver and it does not watch `src` files for changes.

You can publish `build` folder content wherever you want!

## Test

To run tests:

```shell
$ npm test
```

Unit testing is done with **Karma runner** environment and **Jasmine** as framework. Tests run inside **Chrome browser**.

## Todo

- Better responsive layout.
- Use only needed Bootstrap modules (buttons, grid system).
- Implement "[Rock, paper, scissors, Spock, lizard](https://en.wikipedia.org/wiki/Rock-paper-scissors#Additional_weapons)" version.

## License

The MIT License (MIT)

Copyright &copy; 2015 Davide Favia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
