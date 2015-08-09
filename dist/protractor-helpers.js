'use strict';

var ElementArrayFinder = $$('').constructor;
var ElementFinder = $('').constructor;

ElementArrayFinder.prototype.getByText = function (compareText) {
    var foundElement;
    return this.each(function (element) {
        element.getWebElement().getText().then(function (elementText) {
            if (elementText.trim() === compareText) {
                foundElement = element;
            }
        });
    }).then(function () {
        return foundElement;
    });
};

ElementArrayFinder.prototype.$$data = ElementFinder.prototype.$$data = function (hook) {
    return this.all(by.dataHookAll(hook));
};

ElementFinder.prototype.$data = function (hook) {
    return this.element(by.dataHook(hook));
};

'use strict';

(function (global) {
    global.$data = function (hook) {
        return element(by.dataHook(hook));
    };

    global.$$data = function (hook) {
        return element.all(by.dataHookAll(hook));
    };
})(global);

'use strict';

var TIMEOUT = 1000;
var DEFAULT_WIDTH = 1280;
var DEFAULT_HEIGHT = 1024;

function Helpers() {
	browser.getCapabilities().then(function (cap) {
		this.browserName = cap.caps_.browserName;
	}.bind(this));
}

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

// maximized window helpers
Helpers.prototype.maximizeWindow = function (width, height) {
	width = width || DEFAULT_WIDTH;
	height = height || DEFAULT_HEIGHT;
	browser.driver.manage().window().setSize(width, height);
};

// Position helpers
Helpers.prototype.resetPosition = function () {
	$$('[data-hook=start-point]').each(function (startPoint) {
		browser.actions().mouseMove(startPoint).perform();
	});
};

// Hover helpers
Helpers.prototype.displayHover = function (element) {
	browser.actions().mouseMove(element).perform();
	browser.wait(function () {
		return element.isDisplayed();
	});
};

// Calling isDisplayed when element is not present causes an exception.
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

// Calling isDisplayed when element is not present causes an exception.
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

// Select element helper (filter by text)
Helpers.prototype.selectOptionByText = function (select, text) {
	var optionElement = select.element(by.cssContainingText('option', text));
	this.selectOption(optionElement);
};

// Select element helper (filter by index)
Helpers.prototype.selectOptionByIndex = function (select, index) {
	var optionElement = select.all(by.css('option')).get(index);
	this.selectOption(optionElement);
};

// Select helpers
Helpers.prototype.selectOption = function (optionElement) {
	if (this.isFirefox()) {
		browser.actions().mouseMove(optionElement).mouseDown().mouseUp().perform();
	}
	else {
		optionElement.click();
	}
};

// Firefox detection helpers
Helpers.prototype.isFirefox = function () {
	return this.browserName === 'firefox';
};

// IE detection helpers
Helpers.prototype.isIE = function () {
    return this.browserName === 'internet explorer';
};

// Descriptive error messages.
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

// Input clear & set values helpers
Helpers.prototype.clearAndSetValue = function (input, value) {
	input.clear().then(function () {
		input.sendKeys(value);
	});
};

// ClassName helpers
Helpers.prototype.hasClass = function (element, className) {
	return element.getAttribute('class').then(function (classes) {
		return classes.split(' ').indexOf(className) !== -1;
	});
};

// Console error helpers
// Returns a promise which is resolved with an array of all the console errors
Helpers.prototype.getFilteredConsoleErrors = function () {
	if (!this.isIE()) {
		return browser.manage().logs().get('browser').then(function (browserLog) {
			//in CI livereload is not loaded, nsITaskbarTabPreview.invalidate is a mozilla bug
			var filteredLog = browserLog.filter(function (element) {
				return element.level.value > 900 &&
					element.message.indexOf('livereload.js') === -1 &&
					element.message.indexOf('0x80004005 (NS_ERROR_FAILURE) [nsITaskbarTabPreview.invalidate]') === -1;
			});
			if (filteredLog.length > 0) {
				console.log('Browser log: ' + require('util').inspect(filteredLog));
			}
			return filteredLog;
		});
	}
};

module.exports = new Helpers();

'use strict';
var SINGLE_LOCATOR = 'dataHook';
var MULTI_LOCATOR = 'dataHookAll';

// Data-hook is a unique attribute to find elements in e2e tests.
(function () {
    by.addLocator(SINGLE_LOCATOR, function (hook, optParentElement, optRootSelector) {
        var using = optParentElement || document.querySelector(optRootSelector) || document;
        return using.querySelector('[data-hook=\'' + hook + '\']');
    });

    by.addLocator(MULTI_LOCATOR, function (hook, optParentElement, optRootSelector) {
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
