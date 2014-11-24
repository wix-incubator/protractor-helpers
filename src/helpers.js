/* global browser */
'use strict';

function Helpers() {}

// Promise helpers
Helpers.prototype.not = function (promise) {
	return promise.then(function (result) {
		return !result;
	});
};

// Page helpers
Helpers.prototype.safeGet = function (url) {
	browser.get(url);
	this.afterGetPage();
};

Helpers.prototype.maximizeWindow = function () {
	var width = 1280;
	var height = 1024;
	browser.driver.manage().window().setSize(width, height);
};

Helpers.prototype.resetPosition = function () {
	$$('[data-hook=start-point]').each(function (startPoint) {
		browser.actions().mouseMove(startPoint).perform();
	});
};

Helpers.prototype.afterGetPage = function () {
	this.maximizeWindow();
	this.resetPosition();
};

Helpers.prototype.displayHover = function (element) {
	browser.actions().mouseMove(element).perform();
	browser.wait(function () {
		return element.isDisplayed();
	});
};

module.exports = new Helpers();
