"use strict";

const bluebird_1 = require("bluebird");
require("source-map-support/register");
bluebird_1.Promise.config({
    longStackTraces: true,
    cancellation: true
});
module.exports = function tsAwaiter(thisArg, _arguments, ignored, generator) {
    return bluebird_1.Promise.coroutine(generator).call(thisArg, _arguments);
};
//# sourceMappingURL=awaiter.js.map