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