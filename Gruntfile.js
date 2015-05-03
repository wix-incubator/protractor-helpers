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
      scripts: {
        files: [
          'src/**/*.js'
        ],
        tasks: [
          'build'
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
    }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('build', [
    'jshint',
    'concat'
  ]);
	grunt.registerTask('default', ['build']);
};