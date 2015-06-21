'use strict';

// Data-hook is a unique attribute to find elements in e2e tests.
(function () {
	by.addLocator('dataHook', function (hook, optParentElement, optRootSelector) {
		var using = optParentElement || document.querySelector(optRootSelector) || document;
		return using.querySelector('[data-hook=\'' + hook + '\']');
	});

	by.addLocator('dataHookAll', function (hook, optParentElement, optRootSelector) {
		var using = optParentElement || document.querySelector(optRootSelector) || document;
		return using.querySelectorAll('[data-hook=\'' + hook + '\']');
	});
})();