"use strict";

const https = require("https");
const fs_extra_p_1 = require("fs-extra-p");
const url_1 = require("url");
const bluebird_1 = require("bluebird");
const path = require("path");
const maxRedirects = 10;
exports.download = bluebird_1.Promise.promisify(_download);
function _download(url, destination, isCreateDir, callback) {
    if (callback == null) {
        callback = isCreateDir;
        isCreateDir = true;
    }
    doDownload(url, destination, 0, isCreateDir === undefined ? true : isCreateDir, callback);
}
function addTimeOutHandler(request, callback) {
    request.on("socket", function (socket) {
        socket.setTimeout(60 * 1000, () => {
            callback(new Error("Request timed out"));
            request.abort();
        });
    });
}
exports.addTimeOutHandler = addTimeOutHandler;
function doDownload(url, destination, redirectCount, isCreateDir, callback) {
    const ensureDirPromise = isCreateDir ? fs_extra_p_1.ensureDir(path.dirname(destination)) : bluebird_1.Promise.resolve();
    const parsedUrl = url_1.parse(url);
    // user-agent must be specified, otherwise some host can return 401 unauthorised
    const request = https.request({
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        headers: {
            "User-Agent": "electron-builder"
        }
    }, response => {
        if (response.statusCode >= 400) {
            callback(new Error("Request error, status " + response.statusCode + ": " + response.statusMessage));
            return;
        }
        const redirectUrl = response.headers.location;
        if (redirectUrl != null) {
            if (redirectCount < maxRedirects) {
                doDownload(redirectUrl, destination, redirectCount++, isCreateDir, callback);
            } else {
                callback(new Error("Too many redirects (> " + maxRedirects + ")"));
            }
            return;
        }
        ensureDirPromise.then(() => {
            const downloadStream = fs_extra_p_1.createWriteStream(destination);
            response.pipe(downloadStream);
            downloadStream.on("finish", () => downloadStream.close(callback));
        }).catch(callback);
        let ended = false;
        response.on("end", () => {
            ended = true;
        });
        response.on("close", () => {
            if (!ended) {
                callback(new Error("Request aborted"));
            }
        });
    });
    addTimeOutHandler(request, callback);
    request.on("error", callback);
    request.end();
}
//# sourceMappingURL=httpRequest.js.map