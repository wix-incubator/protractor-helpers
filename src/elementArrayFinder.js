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

ElementArrayFinder.prototype.__ = ElementFinder.prototype.__ = function (hook) {
    return this.all(by.dataHookAll(hook));
};

ElementFinder.prototype._ = function (hook) {
    return this.element(by.dataHook(hook));
};
