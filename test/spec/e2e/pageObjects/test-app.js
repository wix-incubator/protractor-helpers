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
  this.hoverDelayed = this.hoverSection.$data('delayed-hover');
  this.ngIfDelayed = this.hoverSection.$data('delayed-ng-if');

  this.repeaterElement = element.all(by.repeater('tool in mainCtrl.tools'));
  this.visibleElement = $data('visible-element');
  this.hiddenElement = $data('hidden-element');
  this.noneExistsElement = $data('none-exists-element');
  this.elementWithText = $data('element-with-text');
  this.elementWithoutText = $data('element-without-text');
  this.percentageElement = $data('element-with-percentage');
  this.dollarElement = $data('element-with-dollar-money');
  this.dollarFractionElement = $data('element-with-dollar-fraction-money');
  this.euroElement = $data('element-with-euro-money');
  this.euroFractionElement = $data('element-with-euro-fraction-money');
  this.inputValue = $data('input-with-value');
  this.disabledInput = $data('disabled-input');
  this.activatedInput = $data('activated-input');
  this.checkbox = $data('checkbox');
  this.form = $data('form');
  this.email = $data('email');

  this.setInputValue = function (element, value) {
    Helpers.clearAndSetValue(element, value);
  };

  this.navigate = function () {
    Helpers.safeGet('/app.html');
  };
}

module.exports = TestPage;

