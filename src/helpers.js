/* global browser, $$ */
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

Helpers.prototype.waitForElement = function (element) {
	browser.wait(function () {
		return element.isDisplayed();
	}, TIMEOUT);
};

Helpers.prototype.isFirefox = function () {
	return this.browserName === 'firefox';
};

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
