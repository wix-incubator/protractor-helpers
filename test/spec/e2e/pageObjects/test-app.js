'use strict';

var Helpers = require('../../../../dist/protractor-helpers');

function TestPage() {

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

  this.singularElement = $('[data-hook=singular-element-data-hook]');
  this.multipleElement = $('[data-hook=multiple-element-data-hook]');
  this.repeaterElement = element.all(by.repeater('tool in mainCtrl.tools'));
  this.visibleElement = $('[data-hook=visible-element]');
  this.hiddenElement = $('[data-hook=hidden-element]');
  this.noneExistsElement = $('[data-hook=none-exists-element]');
  this.elementWithText = $('[data-hook=element-with-text]');
  this.elementWithoutText = $('[data-hook=element-without-text]');
  this.percentageElement = $('[data-hook=element-with-percentage]');
  this.dollarElement = $('[data-hook=element-with-dollar-money]');
  this.dollarFractionElement = $('[data-hook=element-with-dollar-fraction-money]');
  this.euroElement = $('[data-hook=element-with-euro-money]');
  this.euroFractionElement = $('[data-hook=element-with-euro-fraction-money]');
  this.inputValue = $('[data-hook=input-with-value]');
  this.disabledInput = $('[data-hook=disabled-input]');
  this.activatedInput = $('[data-hook=activated-input]');
  this.checkbox = $('[data-hook=checkbox]');
  this.form = $('[data-hook=form]');
  this.email = $('[data-hook=email]');

  this.setInputValue = function (element, value) {
    Helpers.clearAndSetValue(element, value);
  };

  this.navigate = function () {
    Helpers.safeGet('/app.html');
  };
}

module.exports = TestPage;

