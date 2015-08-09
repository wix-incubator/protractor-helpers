'use strict';

(function (global) {
    global._ = function (hook) {
        return element(by.dataHook(hook));
    };

    global.__ = function (hook) {
        return element.all(by.dataHookAll(hook));
    };
})(global);
