'use strict';

var Helpers = require('../../../../dist/protractor-helpers');

function TestPage() {
  this.navigate = function () {
    //Helpers.safeGet('test/app/app.html');
    browser.ignoreSynchronization = true;
    browser.get('app.html');
    browser.sleep(2000);
    browser.ignoreSynchronization = false;

  };

  this.arrayFindersSection = $('.element-array-finder');
  this.singularDataHook = this.arrayFindersSection.$data('singular-element-data-hook');
  this.multipleDataHook = this.arrayFindersSection.$data('multiple-element-data-hook');
}

module.exports = TestPage;

