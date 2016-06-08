"use strict";

const util_1 = require("./util");
const path_1 = require("path");
const url_1 = require("url");
const mime = require("mime");
const fs_extra_p_1 = require("fs-extra-p");
const fs_1 = require("fs");
const gitHubRequest_1 = require("./gitHubRequest");
const bluebird_1 = require("bluebird");
const progressStream = require("progress-stream");
const ProgressBar = require("progress");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
class GitHubPublisher {
    constructor(owner, repo, version, token) {
        let policy = arguments.length <= 4 || arguments[4] === undefined ? "always" : arguments[4];

        this.owner = owner;
        this.repo = repo;
        this.token = token;
        this.policy = policy;
        if (token == null || token.length === 0) {
            throw new Error("GitHub Personal Access Token is not specified");
        }
        this.tag = "v" + version;
        this._releasePromise = this.init();
    }
    get releasePromise() {
        return this._releasePromise;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const createReleaseIfNotExists = this.policy !== "onTagOrDraft";
            // we don't use "Get a release by tag name" because "tag name" means existing git tag, but we draft release and don't create git tag
            const releases = yield gitHubRequest_1.gitHubRequest(`/repos/${ this.owner }/${ this.repo }/releases`, this.token);
            for (let release of releases) {
                if (release.tag_name === this.tag) {
                    if (!release.draft) {
                        if (this.policy === "onTag") {
                            throw new Error("Release must be a draft");
                        } else {
                            const message = `Release ${ this.tag } is not a draft, artifacts will be not published`;
                            if (this.policy === "always") {
                                util_1.warn(message);
                            } else {
                                util_1.log(message);
                            }
                            return null;
                        }
                    }
                    return release;
                }
            }
            if (createReleaseIfNotExists) {
                util_1.log("Release %s doesn't exists, creating one", this.tag);
                return this.createRelease();
            } else {
                return null;
            }
        });
    }
    upload(file, artifactName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = artifactName || path_1.basename(file);
            const release = yield this.releasePromise;
            if (release == null) {
                return;
            }
            const parsedUrl = url_1.parse(release.upload_url.substring(0, release.upload_url.indexOf("{")) + "?name=" + fileName);
            const fileStat = yield fs_extra_p_1.stat(file);
            let badGatewayCount = 0;
            uploadAttempt: for (let i = 0; i < 3; i++) {
                const progressBar = process.stdin.isTTY ? new ProgressBar(`Uploading ${ fileName } [:bar] :percent :etas`, {
                    total: fileStat.size,
                    incomplete: " ",
                    stream: process.stdout,
                    width: 20
                }) : null;
                try {
                    return yield gitHubRequest_1.doGitHubRequest({
                        hostname: parsedUrl.hostname,
                        path: parsedUrl.path,
                        method: "POST",
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "electron-complete-builder",
                            "Content-Type": mime.lookup(fileName),
                            "Content-Length": fileStat.size
                        }
                    }, this.token, (request, reject) => {
                        const fileInputStream = fs_1.createReadStream(file);
                        fileInputStream.on("error", reject);
                        fileInputStream.pipe(progressStream({
                            length: fileStat.size,
                            time: 1000
                        }, progress => progressBar == null ? console.log(".") : progressBar.tick(progress.delta))).pipe(request);
                    });
                } catch (e) {
                    if (e instanceof gitHubRequest_1.HttpError) {
                        if (e.response.statusCode === 422 && e.description != null && e.description.errors != null && e.description.errors[0].code === "already_exists") {
                            // delete old artifact and re-upload
                            util_1.log("Artifact %s already exists, overwrite one", fileName);
                            const assets = yield gitHubRequest_1.gitHubRequest(`/repos/${ this.owner }/${ this.repo }/releases/${ release.id }/assets`, this.token);
                            for (let asset of assets) {
                                if (asset.name === fileName) {
                                    yield gitHubRequest_1.gitHubRequest(`/repos/${ this.owner }/${ this.repo }/releases/assets/${ asset.id }`, this.token, null, "DELETE");
                                    continue uploadAttempt;
                                }
                            }
                            util_1.log("Artifact %s not found, trying to upload again", fileName);
                            continue;
                        } else if (e.response.statusCode === 502 && badGatewayCount++ < 3) {
                            continue;
                        }
                    }
                    throw e;
                }
            }
        });
    }
    createRelease() {
        return gitHubRequest_1.gitHubRequest(`/repos/${ this.owner }/${ this.repo }/releases`, this.token, {
            tag_name: this.tag,
            name: this.tag,
            draft: true
        });
    }
    //noinspection JSUnusedGlobalSymbols
    deleteRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._releasePromise.isFulfilled()) {
                return bluebird_1.Promise.resolve();
            }
            for (let i = 0; i < 3; i++) {
                try {
                    return yield gitHubRequest_1.gitHubRequest(`/repos/${ this.owner }/${ this.repo }/releases/${ this._releasePromise.value().id }`, this.token, null, "DELETE");
                } catch (e) {
                    if (e instanceof gitHubRequest_1.HttpError && (e.response.statusCode === 405 || e.response.statusCode === 502)) {
                        continue;
                    }
                    throw e;
                }
            }
            util_1.warn(`Cannot delete release ${ this._releasePromise.value().id }`);
        });
    }
}
exports.GitHubPublisher = GitHubPublisher;
//# sourceMappingURL=gitHubPublisher.js.map