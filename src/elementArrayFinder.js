'use strict';

var ElementArrayFinder = $$('').constructor;
var ElementFinder = $('').constructor;

ElementArrayFinder.prototype.getByText = function (compareText) {
    return this.filter(function (element) {
        return element.getWebElement().getText().then(function (elementText) {
            return elementText.trim() === compareText;
        })
    }).first();
};

ElementArrayFinder.prototype.getByAttribute = function (attribute, value) {
    return this.filter(function (element) {
        return element.getWebElement().getAttribute(attribute).then(function (elementAttribute) {
            return elementAttribute === value;
        })
    }).first();
};

ElementArrayFinder.prototype.$$data = ElementFinder.prototype.$$data = function (hook) {
    return this.all(by.dataHookAll(hook));
};

ElementFinder.prototype.$data = function (hook) {
    return this.element(by.dataHook(hook));
};
