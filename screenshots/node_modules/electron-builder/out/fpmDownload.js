"use strict";

const util_1 = require("./util");
const fs_extra_p_1 = require("fs-extra-p");
const httpRequest_1 = require("./httpRequest");
const _7zip_bin_1 = require("7zip-bin");
const path = require("path");
const os_1 = require("os");
const bluebird_1 = require("bluebird");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
const versionToPromise = new Map();
// can be called in parallel, all calls for the same version will get the same promise - will be downloaded only once
function downloadFpm(version, osAndArch) {
    let promise = versionToPromise.get(version);
    // if rejected, we will try to download again
    if (promise != null && !promise.isRejected()) {
        return promise;
    }
    promise = doDownloadFpm(version, osAndArch);
    versionToPromise.set(version, promise);
    return promise;
}
exports.downloadFpm = downloadFpm;
function doDownloadFpm(version, osAndArch) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirName = `fpm-${ version }-${ osAndArch }`;
        const url = `https://github.com/develar/fpm-self-contained/releases/download/v${ version }/${ dirName }.7z`;
        // we cache in the global location - in the home dir, not in the node_modules/.cache (https://www.npmjs.com/package/find-cache-dir) because
        // * don't need to find node_modules
        // * don't pollute user project dir (important in case of 1-package.json project structure)
        // * simplify/speed-up tests (don't download fpm for each test project)
        const cacheDir = path.join(os_1.homedir(), ".cache", "fpm");
        const fpmDir = path.join(cacheDir, dirName);
        const fpmDirStat = yield util_1.statOrNull(fpmDir);
        if (fpmDirStat != null && fpmDirStat.isDirectory()) {
            util_1.debug(`Found existing fpm ${ fpmDir }`);
            return path.join(fpmDir, "fpm");
        }
        // 7z cannot be extracted from the input stream, temp file is required
        const tempUnpackDir = path.join(cacheDir, util_1.getTempName());
        const archiveName = `${ tempUnpackDir }.7z`;
        util_1.debug(`Download fpm from ${ url } to ${ archiveName }`);
        // 7z doesn't create out dir
        yield fs_extra_p_1.emptyDir(tempUnpackDir);
        yield httpRequest_1.download(url, archiveName, false);
        yield util_1.spawn(_7zip_bin_1.path7za, util_1.debug7zArgs("x").concat(archiveName, `-o${ tempUnpackDir }`), {
            cwd: cacheDir,
            stdio: ["ignore", util_1.debug.enabled ? "inherit" : "ignore", "inherit"]
        });
        yield bluebird_1.Promise.all([fs_extra_p_1.rename(path.join(tempUnpackDir, dirName), fpmDir).catch(e => {
            console.warn("Cannot move downloaded fpm into final location (another process downloaded faster?): " + e);
        }), fs_extra_p_1.unlink(archiveName)]);
        yield bluebird_1.Promise.all([fs_extra_p_1.remove(tempUnpackDir), fs_extra_p_1.writeFile(path.join(fpmDir, ".lastUsed"), Date.now().toString())]);
        util_1.debug(`fpm downloaded to ${ fpmDir }`);
        return path.join(fpmDir, "fpm");
    });
}
//# sourceMappingURL=fpmDownload.js.map