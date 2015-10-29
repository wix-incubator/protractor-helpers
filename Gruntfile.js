module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    concat: {
      dist: {
        files: [{
          src: [
            'src/*.js'
          ],
          dest: 'dist/protractor-helpers.js'
        }]
      }
    },
    watch: {
      helper: {
        files: [
          'src/**/*.js',
          'test/**/*.*'
        ],
        tasks: [
          'compile', 'protractor:run'
        ],
        options: {
          nospawn: true
        }
      }
    },
    jshint: {
      options: {
        force: false,
        reporter: require('jshint-stylish')
      },
      scripts: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'src/**/*.js'
          ]
        }
      }
    },
    protractor: {
      options: {
        keepAlive: true,
        configFile: "protractor.conf.js"
      },
      run: {}
    },
    connect: {
      server: {
        options: {
          port: 9876,
          base: ['node_modules/', 'test/app']
        }
      }
    }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('compile', [
    'jshint',
    'concat'
  ]);
  grunt.registerTask('build', [
    'compile',
    'connect:server',
    'protractor:run'
  ]);
  grunt.registerTask('serve', [
    'compile',
    'connect:server',
    'watch:helper'
  ]);
	grunt.registerTask('default', ['build']);
};
