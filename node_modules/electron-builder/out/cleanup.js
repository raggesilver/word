#! /usr/bin/env node

"use strict";

const os_1 = require("os");
const fs_extra_p_1 = require("fs-extra-p");
const bluebird_1 = require("bluebird");
const path = require("path");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = path.join(os_1.homedir(), ".cache", "fpm");
        let items = null;
        try {
            items = yield fs_extra_p_1.readdir(dir);
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
            return;
        }
        yield bluebird_1.Promise.map(items, it => __awaiter(this, void 0, void 0, function* () {
            let stat = null;
            const itemPath = path.join(dir, it);
            try {
                stat = yield fs_extra_p_1.lstat(itemPath);
            } catch (e) {
                if (e.code !== "ENOENT") {
                    throw e;
                }
                return;
            }
            if (!stat.isDirectory() || !(yield isRecentlyUsed(itemPath))) {
                console.log(`remove unused ${ itemPath }`);
                yield fs_extra_p_1.remove(itemPath);
            }
        }));
        yield bluebird_1.Promise.map(items, fs_extra_p_1.remove);
    });
}
function isRecentlyUsed(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastUsed = parseInt((yield fs_extra_p_1.readFile(path.join(dir, ".lastUsed"), "utf8")), 10);
            if (!isNaN(lastUsed) && Date.now() - lastUsed < 3600000 * 2) {
                return true;
            }
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
        }
        return false;
    });
}
main();
//# sourceMappingURL=cleanup.js.map