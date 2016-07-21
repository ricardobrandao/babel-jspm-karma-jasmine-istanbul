# Babel JSPM Karma Jasmine Istanbul
A sample repo to show what's need to get HTML code coverage reports working when using **[Babel](https://babeljs.io/)**, **[JSPM](http://jspm.io/)**, **[Karma](http://karma-runner.github.io/)**, **[Jasmine](http://jasmine.github.io/)** and **[Istanbul](https://github.com/gotwarlost/istanbul)**.

To install and run:

```
$ npm install
$ npm run test
$ open coverage/phantomjs/index.html
```

## The goal
Set up Karma testing with code coverage for a project that uses Babel, JSPM and Jasmine.

## Setting up JSPM
Make sure you have jspm installed globally.

```
$ npm install -g jspm
```

Init JSPM:

```
$ jspm init
```

## Creating tests
A sample test is located in `test/app.spec.js`:

```js
'use strict';

import App from 'src/app';

describe('hello', () => {

    it('should return Hello Foo', function() {
        expect(new App().hello()).toEqual('Hello, World!');
    });
});
```

A simple App is can be found at `src/app.js`:

```js
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

class App {
    constructor() {

    }

    hello() {
        return 'Hello, World!';
    }
}

export default App;
```

## Setting up the test environment
Install the basics needed for Jasmine and Karma with PhantomJS and JSPM:

```
$ npm install --save-dev phantomjs jasmine jasmine-core karma karma-jasmine karma-phantomjs-launcher karma-jspm
```

Install the basics needed for transpiling with Babel:

```
$ npm install --save-dev babel-core babel-preset-es2015 karma-babel-preprocessor
```

Also, create a simple `karma.conf.js`:

```js
/* global module */
module.exports = function(config) {
    'use strict';
    config.set({
        autoWatch: true,
        singleRun: true,

        frameworks: ['jspm', 'jasmine'],

        jspm: {
            config: 'config.js',
            paths: {
                '*': '*'
            },
            loadFiles: [
                'test/**/*.spec.js'
            ],
            serveFiles: [
                'src/**/*.js'
            ]
        },

        proxies: {
            '/src/': '/base/src/',
            '/test/': '/base/test/',
            '/jspm_packages': '/base/jspm_packages'
        },

        preprocessors: {
            'src/**/*.js': ['babel']
        },

        reporters: ['progress'],

        browsers: ['PhantomJS']

    });
};
```

Set up your Babel config in `.babelrc`:

```js
{
  "presets": ["es2015"]
}
```

This is needed since SystemJS depends on `Function.bind()`, which is not supported in PhantomJS.

At this point we have a fully working ES2015, Karma, Jasmine, JSPM and Babel setup.

## Coverage
For coverage reports, we'll use Istanbul and the Karma coverage plugin:

```
$ npm install --save-dev istanbul karma-coverage
```

You also need to update your karma config:

```js
preprocessors: {
    'src/!(*spec).js': ['babel', 'coverage']
},

reporters: ['progress', 'coverage'],

coverageReporter: {
    reporters: [
        {
            type: 'text-summary'
        },
        {
            type: 'html',
            dir: 'coverage/'
        }
    ]
}
```

If you run your tests now, you should find a coverage report in the `coverage` folder, with proper highlighting of covered code. However, what you're seeing is the transpiled code.

In order to see the original code we will need a couple more dependencies. First, we'll install [isparta](https://github.com/douglasduteil/isparta), which is designed to be used with Istanbul with Babel and Karma/Karma Coverage:

```
$ npm install --save-dev isparta
```

isparta works as a custom instrumentor, which must be registred in Karma config:

```js
coverageReporter: {
    instrumenters: {isparta: require('isparta')},
    instrumenter: {
        'src/*.js': 'isparta'
    },

    reporters: [
        {
            type: 'text-summary',
        },
        {
            type: 'html',
            dir: 'coverage/',
        }
    ]
}
```

ATM in order to show the original (i.e. ES2015) code in the coverage report we'll need to use a custom version of `karma-coverage`. Update your `package.json` to use `douglasduteil/karma-coverage#next`:

```
"karma-coverage": "douglasduteil/karma-coverage#next"
```

Now the tests are running, we get the coverage reports, and their all in ES2015. However, if you look closely at the coverage for `app.js`, you'll see that the coverage is highlighting the wrong lines. We can fix this by adding source maps.

```
$ npm install --save-dev karma-sourcemap-loader
```

In Karma config:

```js

preprocessors: {
    'src/!(*spec).js': ['babel', 'sourcemap', 'coverage']
},

babelPreprocessor: {
    options: {
        sourceMap: 'inline'
    },
    sourceFileName: function(file) {
        return file.originalPath;
    }
},
```

Again, ATM we need to use a custom version of a dependency, this time Istanbul:

```
"istanbul": "gotwarlost/istanbul.git#source-map"
```

Running Karma again shows that the line highlighting is also working.
