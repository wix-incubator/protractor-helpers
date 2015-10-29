'use strict';

var Helpers = require('../../../../dist/protractor-helpers');

function TestPage() {
  this.navigate = function () {
    browser.get('/app.html');

  };

  this.arrayFindersSection = $('.element-array-finder');
  this.singularDataHook = this.arrayFindersSection.$data('singular-element-data-hook');
  this.multipleDataHook = this.arrayFindersSection.$$data('multiple-element-data-hook');

  this.helpersSection = $('.protractor-helpers');
  this.elementThatUsesTranslateFilter = this.helpersSection.$data('translated-key');

  this.hoverSection = $('.hovered-elements');
  this.hoverTrigger = this.hoverSection.$data('hover-trigger-element');
  this.hoverImmediate = this.hoverSection.$data('immediate-hover');
  this.hoverDelayed = this.hoverSection.$data('delayed-hover');
  this.ngIfDelayed = this.hoverSection.$data('delayed-ng-if');
}

module.exports = TestPage;

