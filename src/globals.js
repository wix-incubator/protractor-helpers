'use strict';

(function (global) {
    global.$data = function (hook) {
        return element(by.dataHook(hook));
    };

    global.$$data = function (hook) {
        return element.all(by.dataHookAll(hook));
    };
})(global);
