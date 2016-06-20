"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const bluebird_1 = require("bluebird");
const glob_1 = require("glob");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
function isNegative(pattern) {
    return pattern[0] === "!";
}
function generateGlobTasks(patterns, opts) {
    opts = Object.assign({ ignore: [] }, opts);
    const globTasks = [];
    patterns.forEach(function (pattern, i) {
        if (isNegative(pattern)) {
            return;
        }
        const ignore = patterns.slice(i).filter(isNegative).map(it => it.slice(1));
        globTasks.push({
            pattern: pattern,
            opts: Object.assign({}, opts, {
                ignore: opts.ignore.concat(ignore)
            })
        });
    });
    return globTasks;
}
function globby(patterns, opts) {
    let firstGlob = null;
    return bluebird_1.Promise.map(generateGlobTasks(patterns, opts), task => new bluebird_1.Promise((resolve, reject) => {
        let glob = new glob_1.Glob(task.pattern, task.opts, (error, matches) => {
            if (error == null) {
                resolve(matches);
            } else {
                reject(error);
            }
        });
        if (firstGlob == null) {
            firstGlob = glob;
        } else {
            glob.statCache = firstGlob.statCache;
            glob.symlinks = firstGlob.symlinks;
            glob.realpathCache = firstGlob.realpathCache;
            glob.cache = firstGlob.cache;
        }
    })).then(it => {
        var _ref;

        return new Set((_ref = []).concat.apply(_ref, _toConsumableArray(it)));
    });
}
exports.globby = globby;
//# sourceMappingURL=globby.js.map