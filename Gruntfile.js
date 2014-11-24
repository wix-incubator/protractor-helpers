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
          'src/**/*.js',
          'test/**/*.js'
        ],
        tasks: [
          'build'
        ],
        options: {
          nospawn: true
        }
      }
    },

    release: {
      options: {
        file: 'bower.json',
        npm: false
      }
    },

  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('build', [
    'concat'
  ]);

};