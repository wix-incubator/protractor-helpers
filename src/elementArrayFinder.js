'use strict';

var ElementArrayFinder = $$('').constructor;

ElementArrayFinder.prototype.getByText = function (compareText) {
	var foundElement;
	return this.each(function (element) {
		element.getText().then(function (elementText) {
			if (elementText.trim() === compareText) {
				foundElement = element;
			}
		});
	}).then(function () {
		return foundElement;
	});
};