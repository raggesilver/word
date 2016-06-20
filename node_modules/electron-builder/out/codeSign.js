"use strict";

const util_1 = require("./util");
const fs_extra_p_1 = require("fs-extra-p");
const httpRequest_1 = require("./httpRequest");
const os_1 = require("os");
const path = require("path");
const promise_1 = require("./promise");
const bluebird_1 = require("bluebird");
const crypto_1 = require("crypto");
const os_2 = require("os");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
exports.appleCertificatePrefixes = ["Developer ID Application:", "3rd Party Mac Developer Application:", "Developer ID Installer:", "3rd Party Mac Developer Installer:"];
function generateKeychainName() {
    return path.join(os_1.tmpdir(), util_1.getTempName("csc") + ".keychain");
}
exports.generateKeychainName = generateKeychainName;
function downloadUrlOrBase64(urlOrBase64, destination) {
    if (urlOrBase64.startsWith("https://")) {
        return httpRequest_1.download(urlOrBase64, destination);
    } else {
        return fs_extra_p_1.outputFile(destination, new Buffer(urlOrBase64, "base64"));
    }
}
let bundledCertKeychainAdded = null;
// "Note that filename will not be searched to resolve the signing identity's certificate chain unless it is also on the user's keychain search list."
// but "security list-keychains" doesn't support add - we should 1) get current list 2) set new list - it is very bad http://stackoverflow.com/questions/10538942/add-a-keychain-to-search-list
// "overly complicated and introduces a race condition."
// https://github.com/electron-userland/electron-builder/issues/398
function createCustomCertKeychain() {
    return __awaiter(this, void 0, void 0, function* () {
        // copy to temp and then atomic rename to final path
        const tmpKeychainPath = path.join(os_2.homedir(), ".cache", util_1.getTempName("electron_builder_root_certs"));
        const keychainPath = path.join(os_2.homedir(), ".cache", "electron_builder_root_certs.keychain");
        const results = yield bluebird_1.Promise.all([util_1.exec("security", ["list-keychains"]), fs_extra_p_1.copy(path.join(__dirname, "..", "certs", "root_certs.keychain"), tmpKeychainPath).then(() => fs_extra_p_1.rename(tmpKeychainPath, keychainPath))]);
        const list = results[0].split("\n").map(it => {
            let r = it.trim();
            return r.substring(1, r.length - 1);
        }).filter(it => it.length > 0);
        if (!(list.indexOf(keychainPath) !== -1)) {
            yield util_1.exec("security", ["list-keychains", "-d", "user", "-s", keychainPath].concat(list));
        }
    });
}
function createKeychain(keychainName, cscLink, cscKeyPassword, cscILink, cscIKeyPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bundledCertKeychainAdded == null) {
            bundledCertKeychainAdded = createCustomCertKeychain();
        }
        yield bundledCertKeychainAdded;
        const certLinks = [cscLink];
        if (cscILink != null) {
            certLinks.push(cscILink);
        }
        const certPaths = new Array(certLinks.length);
        const keychainPassword = crypto_1.randomBytes(8).toString("hex");
        return yield promise_1.executeFinally(bluebird_1.Promise.all([bluebird_1.Promise.map(certLinks, (link, i) => {
            const tempFile = path.join(os_1.tmpdir(), `${ util_1.getTempName() }.p12`);
            certPaths[i] = tempFile;
            return downloadUrlOrBase64(link, tempFile);
        }), bluebird_1.Promise.mapSeries([["create-keychain", "-p", keychainPassword, keychainName], ["unlock-keychain", "-p", keychainPassword, keychainName], ["set-keychain-settings", "-t", "3600", "-u", keychainName]], it => util_1.exec("security", it))]).then(() => importCerts(keychainName, certPaths, [cscKeyPassword, cscIKeyPassword].filter(it => it != null))), errorOccurred => {
            const tasks = certPaths.map(it => fs_extra_p_1.deleteFile(it, true));
            if (errorOccurred) {
                tasks.push(deleteKeychain(keychainName));
            }
            return promise_1.all(tasks);
        });
    });
}
exports.createKeychain = createKeychain;
function importCerts(keychainName, paths, keyPasswords) {
    return __awaiter(this, void 0, void 0, function* () {
        const namePromises = [];
        for (let i = 0; i < paths.length; i++) {
            const password = keyPasswords[i];
            const certPath = paths[i];
            yield util_1.exec("security", ["import", certPath, "-k", keychainName, "-T", "/usr/bin/codesign", "-T", "/usr/bin/productbuild", "-P", password]);
            namePromises.push(extractCommonName(password, certPath));
        }
        const names = yield bluebird_1.Promise.all(namePromises);
        return {
            name: names[0],
            installerName: names.length > 1 ? names[1] : null,
            keychainName: keychainName
        };
    });
}
function extractCommonName(password, certPath) {
    return util_1.exec("openssl", ["pkcs12", "-nokeys", "-nodes", "-passin", "pass:" + password, "-nomacver", "-clcerts", "-in", certPath]).then(result => {
        const match = result.match(/^subject.*\/CN=([^\/\n]+)/m);
        if (match == null || match[1] == null) {
            throw new Error("Cannot extract common name from p12");
        } else {
            return match[1];
        }
    });
}
function sign(path, options) {
    const args = ["--deep", "--force", "--sign", options.name, path];
    if (options.keychainName != null) {
        args.push("--keychain", options.keychainName);
    }
    return util_1.exec("codesign", args);
}
exports.sign = sign;
function deleteKeychain(keychainName) {
    let ignoreNotFound = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    const result = util_1.exec("security", ["delete-keychain", keychainName]);
    if (ignoreNotFound) {
        return result.catch(error => {
            if (!(error.message.indexOf("The specified keychain could not be found.") !== -1)) {
                throw error;
            }
        });
    } else {
        return result;
    }
}
exports.deleteKeychain = deleteKeychain;
function downloadCertificate(cscLink) {
    const certPath = path.join(os_1.tmpdir(), `${ util_1.getTempName() }.p12`);
    return downloadUrlOrBase64(cscLink, certPath).thenReturn(certPath);
}
exports.downloadCertificate = downloadCertificate;
exports.findIdentityRawResult = null;
function findIdentity(namePrefix, qualifier) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.findIdentityRawResult == null) {
            exports.findIdentityRawResult = util_1.exec("security", ["find-identity", "-v", "-p", "codesigning"]);
        }
        const lines = (yield exports.findIdentityRawResult).trim().split("\n");
        // ignore last line valid identities found
        lines.length = lines.length - 1;
        for (let line of lines) {
            if (qualifier != null && !(line.indexOf(qualifier) !== -1)) {
                continue;
            }
            if (line.indexOf(namePrefix) !== -1) {
                return line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
            }
        }
        if (namePrefix === "Developer ID Application") {
            // find non-Apple certificate
            // https://github.com/electron-userland/electron-builder/issues/458
            l: for (let line of lines) {
                if (qualifier != null && !(line.indexOf(qualifier) !== -1)) {
                    continue;
                }
                for (let prefix of exports.appleCertificatePrefixes) {
                    if (line.indexOf(prefix) !== -1) {
                        continue l;
                    }
                }
                return line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
            }
        }
        return null;
    });
}
exports.findIdentity = findIdentity;
//# sourceMappingURL=codeSign.js.map