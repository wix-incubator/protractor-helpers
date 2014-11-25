/*global browser, beforeEach */
'use strict';

(function () {
	function createMessage(context, message) {
		context.message = function () {
			var msg = message
				.replace('{{actual}}', context.actual)
				.replace('{{not}}', (context.isNot ? ' not ' : ' '));
			
			if (context.actual.locator) {
				msg = msg.replace('{{locator}}', context.actual.locator());
			}
			return msg;
		};
	}
	beforeEach(function () {
		this.addMatchers({
			toBePresent: function () {
				createMessage(this, 'Expected {{locator}}{{not}}to Be Present');
				return this.actual.isPresent();
			},
			toBeDisplayed: function () {
				createMessage(this, 'Expected {{locator}}{{not}}to Be Displayed');
				return this.actual.isDisplayed();
			},
			toHaveLengthOf: function (expectedLength) {
				createMessage(this, 'Expected request{{not}}to have length of ' + expectedLength + ' but was {{actual}}');
				return this.actual === expectedLength;
			},
			toHaveText: function (expectedText) {
				var _this = this;
				return this.actual.getText().then(function (text) {
					createMessage(_this, 'Expected {{locator}}{{not}}to have text ' + expectedText + ' but was ' + text);
					return text === expectedText;
				});
			},
			toMatchRegex: function (expectedPattern) {
				var _this = this;
				var re = new RegExp(expectedPattern);
				return this.actual.getText().then(function (text) {
					createMessage(_this, 'Expected {{locator}} with text ' + text + '{{not}}to match pattern ' + expectedPattern);
					return re.test(text);
				});
			},
			toHaveValue: function (expectedValue) {
				var _this = this;
				return this.actual.getAttribute('value').then(function (value) {
					createMessage(_this, 'Expected {{locator}}{{not}} to have value ' + expectedValue + ' but was ' + value);
					return value === expectedValue;
				});
			},
			toHaveClass: function (className) {
				var _this = this;
				return this.actual.getAttribute('class').then(function (classes) {
					createMessage(_this, 'Expected ' + classes + '{{not}}to have class ' + className);

					return classes.split(' ').indexOf(className) !== -1;
				});
			},
			toBeDisabled: function () {
				createMessage(this, 'Expected {{locator}}{{not}} to be Disabled');
				return this.actual.getAttribute('disabled').then(function (value) {
					return value === 'true';
				});
			},
			toBeChecked: function () {
				createMessage(this, 'Expected {{locator}}{{not}} to be checked');
				return this.actual.getAttribute('checked').then(function (value) {
					return value;
				});
			},
			toHaveFocus: function () {
				var _this = this;
				var activeElement = browser.driver.switchTo().activeElement();
				return this.actual.getOuterHtml().then(function (html1) {
					return activeElement.getOuterHtml().then(function (html2) {
						createMessage(_this, 'Expected ' + html1.substring(0, 40) + '{{not}} to have focus, but focus is on ' + html2.substring(0, 40) + '...');
						return html1 === html2;
					});
				});
			}
		});
	});
})();