'use strict';

var Helpers = require('../../../../dist/protractor-helpers');

function TestPage() {
  this.navigate = function () {
    browser.get('/app.html');

  };

  this.arrayFindersSection = $('.element-array-finder');
  this.singularDataHook = this.arrayFindersSection.$data('singular-element-data-hook');
  this.multipleDataHook = this.arrayFindersSection.$$data('multiple-element-data-hook');
}

module.exports = TestPage;

