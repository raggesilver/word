"use strict";

const packager_1 = require("./packager");
const gitHubPublisher_1 = require("./gitHubPublisher");
const promise_1 = require("./promise");
const bluebird_1 = require("bluebird");
const repositoryInfo_1 = require("./repositoryInfo");
const util_1 = require("./util");
const metadata_1 = require("./metadata");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
function createPublisher(packager, options, repoSlug) {
    let isPublishOptionGuessed = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    return __awaiter(this, void 0, void 0, function* () {
        const info = yield repoSlug.getInfo(packager);
        if (info == null) {
            if (isPublishOptionGuessed) {
                return null;
            }
            util_1.warn("Cannot detect repository by .git/config");
            throw new Error(`Please specify 'repository' in the dev package.json ('${ packager.devPackageFile }')`);
        } else {
            util_1.log(`Creating Github Publisher — user: ${ info.user }, project: ${ info.project }, version: ${ packager.metadata.version }`);
            return new gitHubPublisher_1.GitHubPublisher(info.user, info.project, packager.metadata.version, options.githubToken, options.publish);
        }
    });
}
exports.createPublisher = createPublisher;
function addValue(map, key, value) {
    const list = map.get(key);
    if (list == null) {
        map.set(key, [value]);
    } else {
        list.push(value);
    }
}
function normalizeOptions(args) {
    if (args.targets != null) {
        return args;
    }
    let targets = new Map();
    function processTargets(platform, types) {
        if (args.platform != null) {
            throw new Error(`--platform cannot be used if --${ platform.buildConfigurationKey } is passed`);
        }
        if (args.arch != null) {
            throw new Error(`--arch cannot be used if --${ platform.buildConfigurationKey } is passed`);
        }
        function commonArch() {
            if (args.ia32 && args.x64) {
                return [metadata_1.Arch.x64, metadata_1.Arch.ia32];
            } else if (args.ia32) {
                return [metadata_1.Arch.ia32];
            } else if (args.x64) {
                return [metadata_1.Arch.x64];
            } else {
                return [metadata_1.archFromString(process.arch)];
            }
        }
        let archToType = targets.get(platform);
        if (archToType == null) {
            archToType = new Map();
            targets.set(platform, archToType);
        }
        if (types.length === 0) {
            for (let arch of commonArch()) {
                archToType.set(arch, []);
            }
            return;
        }
        for (let type of types) {
            let arch;
            if (platform === metadata_1.Platform.OSX) {
                arch = "x64";
                addValue(archToType, metadata_1.Arch.x64, type);
            } else {
                const suffixPos = type.lastIndexOf(":");
                if (suffixPos > 0) {
                    addValue(archToType, metadata_1.archFromString(type.substring(suffixPos + 1)), type.substring(0, suffixPos));
                } else {
                    for (let arch of commonArch()) {
                        addValue(archToType, arch, type);
                    }
                }
            }
        }
    }
    if (args.osx != null) {
        processTargets(metadata_1.Platform.OSX, args.osx);
    }
    if (args.linux != null) {
        processTargets(metadata_1.Platform.LINUX, args.linux);
    }
    if (args.win != null) {
        processTargets(metadata_1.Platform.WINDOWS, args.win);
    }
    if (targets.size === 0) {
        if (args.platform == null) {
            processTargets(metadata_1.Platform.current(), []);
        } else {
            targets = createTargets(packager_1.normalizePlatforms(args.platform), null, args.arch);
        }
    }
    const result = Object.assign({}, args);
    result.targets = targets;
    delete result.osx;
    delete result.linux;
    delete result.win;
    delete result.platform;
    delete result.arch;
    delete result["o"];
    delete result["l"];
    delete result["w"];
    delete result["windows"];
    delete result["$0"];
    delete result["_"];
    delete result.version;
    delete result.help;
    delete result.ia32;
    delete result.x64;
    return result;
}
exports.normalizeOptions = normalizeOptions;
function createTargets(platforms, type, arch) {
    const targets = new Map();
    for (let platform of platforms) {
        const archs = platform === metadata_1.Platform.OSX ? [metadata_1.Arch.x64] : arch === "all" ? [metadata_1.Arch.x64, metadata_1.Arch.ia32] : [metadata_1.archFromString(arch == null ? process.arch : arch)];
        const archToType = new Map();
        targets.set(platform, archToType);
        for (let arch of archs) {
            archToType.set(arch, type == null ? [] : [type]);
        }
    }
    return targets;
}
exports.createTargets = createTargets;
function build(rawOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = normalizeOptions(rawOptions || {});
        if (options.cscLink === undefined && !util_1.isEmptyOrSpaces(process.env.CSC_LINK)) {
            options.cscLink = process.env.CSC_LINK;
        }
        if (options.cscKeyPassword === undefined && !util_1.isEmptyOrSpaces(process.env.CSC_KEY_PASSWORD)) {
            options.cscKeyPassword = process.env.CSC_KEY_PASSWORD;
        }
        if (options.githubToken === undefined && !util_1.isEmptyOrSpaces(process.env.GH_TOKEN)) {
            options.githubToken = process.env.GH_TOKEN;
        }
        let isPublishOptionGuessed = false;
        if (options.publish === undefined) {
            if (process.env.npm_lifecycle_event === "release") {
                options.publish = "always";
            } else if (options.githubToken != null) {
                const tag = process.env.TRAVIS_TAG || process.env.APPVEYOR_REPO_TAG_NAME || process.env.CIRCLE_TAG;
                if (tag != null && tag.length !== 0) {
                    util_1.log("Tag %s is defined, so artifacts will be published", tag);
                    options.publish = "onTag";
                    isPublishOptionGuessed = true;
                } else if ((process.env.CI || "").toLowerCase() === "true") {
                    util_1.log("CI detected, so artifacts will be published if draft release exists");
                    options.publish = "onTagOrDraft";
                    isPublishOptionGuessed = true;
                }
            }
        }
        const publishTasks = [];
        const repositoryInfo = new repositoryInfo_1.InfoRetriever();
        const packager = new packager_1.Packager(options, repositoryInfo);
        if (options.publish != null && options.publish !== "never") {
            let publisher = null;
            packager.artifactCreated(event => {
                if (publisher == null) {
                    publisher = createPublisher(packager, options, repositoryInfo, isPublishOptionGuessed);
                }
                if (publisher) {
                    publisher.then(it => publishTasks.push(it.upload(event.file, event.artifactName)));
                }
            });
        }
        yield promise_1.executeFinally(packager.build(), errorOccurred => {
            if (errorOccurred) {
                for (let task of publishTasks) {
                    task.cancel();
                }
                return bluebird_1.Promise.resolve(null);
            } else {
                return bluebird_1.Promise.all(publishTasks);
            }
        });
    });
}
exports.build = build;
//# sourceMappingURL=builder.js.map