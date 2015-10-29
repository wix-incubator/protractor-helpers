/* global browser, angular, document, beforeEach, afterEach */
'use strict';

var fs = require('fs');
var glob = require('glob');

var config = {};

config.allScriptsTimeout = 120000;

config.baseUrl = '';

config.specs = [
	process.cwd() + '/test/spec/e2e/**/*.js',
	process.cwd() + '/test/e2e/spec/**/*.js'
];

config.framework = 'jasmine';

config.capabilities = {
	browserName: 'chrome',
	shardTestFiles: true,
	maxInstances: 6
};

module.exports.config = config;
