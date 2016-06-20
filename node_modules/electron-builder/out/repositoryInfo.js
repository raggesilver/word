"use strict";

const hosted_git_info_1 = require("hosted-git-info");
const fs_extra_p_1 = require("fs-extra-p");
const path = require("path");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
class InfoRetriever {
    getInfo(provider) {
        if (this._info == null) {
            this._info = getInfo(provider);
        }
        return this._info;
    }
}
exports.InfoRetriever = InfoRetriever;
function getGitUrlFromGitConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = null;
        try {
            data = yield fs_extra_p_1.readFile(path.join(".git", "config"), "utf8");
        } catch (e) {
            if (e.code === "ENOENT") {
                return null;
            }
            throw e;
        }
        const conf = data.split(/\r?\n/);
        const i = conf.indexOf('[remote "origin"]');
        if (i !== -1) {
            let u = conf[i + 1];
            if (!u.match(/^\s*url =/)) {
                u = conf[i + 2];
            }
            if (u.match(/^\s*url =/)) {
                return u.replace(/^\s*url = /, "");
            }
        }
        return null;
    });
}
function getInfo(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = provider == null ? null : provider.devMetadata.repository || provider.metadata.repository;
        if (repo == null) {
            let url = process.env.TRAVIS_REPO_SLUG;
            if (url == null) {
                const user = process.env.APPVEYOR_ACCOUNT_NAME || process.env.CIRCLE_PROJECT_USERNAME;
                const project = process.env.APPVEYOR_PROJECT_NAME || process.env.CIRCLE_PROJECT_REPONAME;
                if (user != null && project != null) {
                    return {
                        user: user,
                        project: project
                    };
                }
                url = yield getGitUrlFromGitConfig();
            }
            if (url != null) {
                return hosted_git_info_1.fromUrl(url);
            }
        } else {
            return hosted_git_info_1.fromUrl(typeof repo === "string" ? repo : repo.url);
        }
        return null;
    });
}
//# sourceMappingURL=repositoryInfo.js.map