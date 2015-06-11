'use strict';

(function () {
	var helpers = new Helpers();
	
	beforeEach(function () {
		this.addMatchers({
			toBePresent: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}}to Be Present');
				return this.actual.isPresent();
			},
			toBeDisplayed: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}}to Be Displayed');
				return this.actual.isDisplayed();
			},
			toHaveLengthOf: function (expectedLength) {
				helpers.createMessage(this, 'Expected request{{not}}to have length of ' + expectedLength + ' but was {{actual}}');
				return this.actual === expectedLength;
			},
			toHaveText: function (expectedText) {
				var _this = this;
				return this.actual.getText().then(function (text) {
					helpers.createMessage(_this, 'Expected {{locator}}{{not}}to have text ' + expectedText + ' but was ' + text);
					return text === expectedText;
				});
			},
			toMatchRegex: function (expectedPattern) {
				var _this = this;
				var re = new RegExp(expectedPattern);
				return this.actual.getText().then(function (text) {
					helpers.createMessage(_this, 'Expected {{locator}} with text ' + text + '{{not}}to match pattern ' + expectedPattern);
					return re.test(text);
				});
			},
			toMatchMoney: function (expectedValue, currencySymbol) {
				var _this = this;
				var regexExpectedValue = createMoneyRegexp(this.actual, expectedValue, currencySymbol, false);
				helpers.createMessage(_this, 'Expected ' + this.actual + '{{not}}to match money pattern ' + regexExpectedValue);
				return regexExpectedValue.test(this.actual);
			},
			toMatchMoneyWithFraction: function (expectedValue, currencySymbol) {
				var _this = this;
				var regexExpectedValue = createMoneyRegexp(this.actual, expectedValue, currencySymbol, true);
				helpers.createMessage(_this, 'Expected ' + this.actual + '{{not}}to match money pattern ' + regexExpectedValue);
				return regexExpectedValue.test(this.actual);
			},
			toHaveValue: function (expectedValue) {
				var _this = this;
				return this.actual.getAttribute('value').then(function (value) {
					helpers.createMessage(_this, 'Expected {{locator}}{{not}} to have value ' + expectedValue + ' but was ' + value);
					return value === expectedValue;
				});
			},
			toHaveClass: function (className) {
				var _this = this;
				helpers.createMessage(_this, 'Expected {{locator}}{{not}}to have class ' + className);
				return helpers.hasClass(this.actual, className);
			},
			toBeDisabled: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}} to be Disabled');
				return this.actual.getAttribute('disabled').then(function (value) {
					return value === 'true';
				});
			},
			toBeChecked: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}} to be checked');
				return this.actual.getAttribute('checked').then(function (value) {
					return value;
				});
			},
			toHaveFocus: function () {
				var _this = this;
				var activeElement = browser.driver.switchTo().activeElement();
				return this.actual.getOuterHtml().then(function (html1) {
					return activeElement.getOuterHtml().then(function (html2) {
						helpers.createMessage(_this, 'Expected ' + html1.substring(0, 40) + '{{not}} to have focus, but focus is on ' + html2.substring(0, 40) + '...');
						return html1 === html2;
					});
				});
			},
			toBeValid: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}} to have valid input value');
				return helpers.hasClass(this.actual, 'ng-valid');
			},
			toBeInvalid: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}} to have invalid input value');
				return helpers.hasClass(this.actual, 'ng-invalid');
			},
			toBeInvalidRequired: function () {
				helpers.createMessage(this, 'Expected {{locator}}{{not}} to be required and invalid (when empty)');
				return helpers.hasClass(this.actual, 'ng-invalid-required');
			},
			toMatchTranslated: function (key, values) {
				var _this = this;
				return helpers.translate(key, values).then(function (translatedStr) {
					helpers.createMessage(_this, 'Expected {{actual}}{{not}} to match ' + translatedStr + ' (translated from ' + key + ', values: ' + JSON.stringify(values) + ')');
					var re = new RegExp(translatedStr);
					return re.test(_this.actual);
				});
			}
		});
	});

	////////////////////////////////////////////////////////////////////////////////////////////////////
	//	Money Matcher Functions
	////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Gets a number and adds commas in the right place
	 * @param number
	 * @returns {string}
	 */
	var getNumberWithCommas = function (number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	/**
	 * Creates a regular expression to match money representation with or without spaces in between
	 * @param matchedValue - the number that is tested
	 * @param expectedValue - the number to match against
	 * @param currencySymbol {string}
	 * @param isFraction {boolean} - flag to add the necessary postfix to expectedValue
	 * @returns {RegExp}
	 */
	var createMoneyRegexp = function (matchedValue, expectedValue, currencySymbol, isFraction) {
		var minusSign = '';
		if (matchedValue.indexOf('-') !== -1) {
			minusSign = '-';
		}

		expectedValue = getNumberWithCommas(expectedValue);
		if (isFraction && expectedValue.indexOf('.') === -1) {
			expectedValue += '.00';
		}
		return new RegExp('^' + minusSign + '\\s*' + '\\' + currencySymbol + '\\s*' + expectedValue + '$');
	};
})();