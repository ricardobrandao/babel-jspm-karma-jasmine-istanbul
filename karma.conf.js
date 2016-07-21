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
            'src/**/*.js': ['babel', 'sourcemap', 'coverage']
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
          instrumenters: {isparta: require('isparta')},
        	instrumenter: {
        		'src/*.js': 'isparta'
        	},

        	reporters: [
        		{
        			type: 'text-summary'
        		},
        		{
        			type: 'html',
        			dir: 'coverage/'
        		}
        	]
        },

        browsers: ['PhantomJS']

    });
};
