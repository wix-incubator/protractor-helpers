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

Helpers.prototype.moveToElement = function (dataHook) {
	$$(dataHook).each(function (element) {
		browser.actions().mouseMove(element).perform();
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
Helpers.prototype.createMessage = function (actual, message, isNot) {
	var msg = message
		.replace('{{actual}}', actual)
		.replace('{{not}}', (isNot ? ' not ' : ' '));

	if (actual.locator) {
		msg = msg.replace('{{locator}}', actual.locator());
	}

	return msg;
};

// Input clear & set values helpers
Helpers.prototype.clearAndSetValue = function (input, value) {
	return input.clear().then(function () {
		return input.sendKeys(value);
	});
};

// ClassName helpers
Helpers.prototype.hasClass = function (element, className) {
	return element.getAttribute('class').then(function (classes) {
		return classes.split(' ').indexOf(className) !== -1;
	});
};

// ClassName helpers
Helpers.prototype.hasLink = function (element, url) {
	return element.getAttribute('href').then(function (href) {
		return href === url;
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
