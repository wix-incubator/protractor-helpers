'use strict';

function Helpers() {
	browser.getCapabilities().then(function (cap) {
		this.browserName = cap.caps_.browserName;
	}.bind(this));
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

Helpers.prototype.isIE = function () {
	return Helpers.browserName === 'internet explorer';
};

Helpers.prototype.clearAndSetValue = function (input, value) {
	input.clear().then(function () {
		input.sendKeys(value);
	});
};

Helpers.prototype.isFieldInvalid = function (field) {
	return this.hasClass(field, 'ng-invalid');
};

Helpers.prototype.isFieldValid = function (field) {
	return this.hasClass(field, 'ng-valid');
};

Helpers.prototype.isFieldRequiredInvalid = function (field) {
	return this.hasClass(field, 'ng-invalid-required');
};

Helpers.prototype.hasClass = function (element, clss) {
	return element.getAttribute('class').then(function (classes) {
		return classes.split(' ').indexOf(clss) !== -1;
	});
};

Helpers.prototype.switchToFullscreen = function () {
	browser.driver.manage().window().maximize();
};

Helpers.prototype.getFilteredConsoleErrors = function () {
	return this.runIfNotIE(function () {
		browser.manage().logs().get('browser').then(function (browserLog) {
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
	});
};

module.exports = new Helpers();
