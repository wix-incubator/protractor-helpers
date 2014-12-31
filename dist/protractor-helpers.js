'use strict';

function Helpers() {
	browser.getCapabilities().then(function (cap) {
		this.browserName = cap.caps_.browserName;
	});
}

var TIMEOUT = 1000;
var DEFAULT_WIDTH = 1280;
var DEFAULT_HEIGHT = 1024;

// Promise helpers
Helpers.prototype.not = function (promise) {
	return promise.then(function (result) {
		return !result;
	});
};

// Translation helpers
Helpers.prototype.translate = function (key, values) {
	return browser.executeScript(function (key, values) {
		var $translate = angular.element(document.body).injector().get('$translate');
		return $translate(key, values);
	}, key, values);
};

// Page helpers
Helpers.prototype.safeGet = function (url) {
	browser.get(url);
	this.maximizeWindow();
	this.resetPosition();
};

Helpers.prototype.maximizeWindow = function (width, height) {
	width = width || DEFAULT_WIDTH;
	height = height || DEFAULT_HEIGHT;
	browser.driver.manage().window().setSize(width, height);
};

Helpers.prototype.resetPosition = function () {
	$$('[data-hook=start-point]').each(function (startPoint) {
		browser.actions().mouseMove(startPoint).perform();
	});
};

Helpers.prototype.displayHover = function (element) {
	browser.actions().mouseMove(element).perform();
	browser.wait(function () {
		return element.isDisplayed();
	});
};

// Calling isDisplayed when element is not present causes an exception
Helpers.prototype.waitForElement = function (element, timeout) {
	browser.wait(function () {
		return element.isPresent().then(function (isPresent) {
			if (isPresent) {
				return element.isDisplayed();
			}
			else {
				return false;
			}
		});
	}, timeout || TIMEOUT);
};

// Calling isDisplayed when element is not present causes an exception
Helpers.prototype.waitForElementToDisappear = function (element, timeout) {
	var _this = this;
	browser.wait(function () {
		return element.isPresent().then(function (isPresent) {
			if (isPresent) {
				return _this.not(element.isDisplayed());
			}
			else {
				return true;
			}
		});
	}, timeout || TIMEOUT);
};

Helpers.prototype.selectOptionByText = function (select, text) {
	var optionElement = select.element(by.cssContainingText('option', text));
	this.selectOption(optionElement);
};

// zero-based index
Helpers.prototype.selectOptionByIndex = function (select, index) {
	var optionElement = select.all(by.css('option')).get(index);
	this.selectOption(optionElement);
};

Helpers.prototype.selectOption = function (optionElement) {
	if (this.isFirefox()) {
		browser.actions().mouseMove(optionElement).mouseDown().mouseUp().perform();
	}
	else {
		optionElement.click();
	}
};

Helpers.prototype.isFirefox = function () {
	return this.browserName === 'firefox';
};

// For matchers
Helpers.prototype.createMessage = function (context, message) {
	context.message = function () {
		var msg = message
			.replace('{{actual}}', context.actual)
			.replace('{{not}}', (context.isNot ? ' not ' : ' '));
		
		if (context.actual.locator) {
			msg = msg.replace('{{locator}}', context.actual.locator());
		}
		return msg;
	};
};

module.exports = new Helpers();

'use strict';

(function () {
	by.addLocator('dataHook', function (hook, optParentElement, optRootSelector) {
		var using = optParentElement || document.querySelector(optRootSelector) || document;
		return using.querySelector('[data-hook=\'' + hook + '\']');
	});

	by.addLocator('dataHookAll', function (hook, optParentElement, optRootSelector) {
		var using = optParentElement || document.querySelector(optRootSelector) || document;
		return using.querySelectorAll('[data-hook=\'' + hook + '\']');
	});
})();
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
				return this.actual.getAttribute('class').then(function (classes) {
					helpers.createMessage(_this, 'Expected ' + classes + '{{not}}to have class ' + className);

					return classes.split(' ').indexOf(className) !== -1;
				});
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