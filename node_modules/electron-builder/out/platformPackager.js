"use strict";

const metadata_1 = require("./metadata");
const bluebird_1 = require("bluebird");
const path = require("path");
const electron_packager_tf_1 = require("electron-packager-tf");
const globby_1 = require("./globby");
const fs_extra_p_1 = require("fs-extra-p");
const util_1 = require("./util");
const asar_1 = require("asar");
const _7zip_bin_1 = require("7zip-bin");
const deepAssign = require("deep-assign");
const glob_1 = require("glob");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
class CompressionDescriptor {
    constructor(flag, env, minLevel) {
        let maxLevel = arguments.length <= 3 || arguments[3] === undefined ? "-9" : arguments[3];

        this.flag = flag;
        this.env = env;
        this.minLevel = minLevel;
        this.maxLevel = maxLevel;
    }
}
const extToCompressionDescriptor = {
    "tar.xz": new CompressionDescriptor("--xz", "XZ_OPT", "-0", "-9e"),
    "tar.lz": new CompressionDescriptor("--lzip", "LZOP", "-0"),
    "tar.gz": new CompressionDescriptor("--gz", "GZIP", "-1"),
    "tar.bz2": new CompressionDescriptor("--bzip2", "BZIP2", "-1")
};
exports.commonTargets = ["dir", "zip", "7z", "tar.xz", "tar.lz", "tar.gz", "tar.bz2"];
exports.DIR_TARGET = "dir";
class PlatformPackager {
    constructor(info) {
        this.info = info;
        this.options = info.options;
        this.projectDir = info.projectDir;
        this.metadata = info.metadata;
        this.devMetadata = info.devMetadata;
        this.buildResourcesDir = path.resolve(this.projectDir, this.relativeBuildResourcesDirname);
        this.customBuildOptions = info.devMetadata.build[this.platform.buildConfigurationKey] || Object.create(null);
        this.appName = metadata_1.getProductName(this.metadata, this.devMetadata);
        this.resourceList = fs_extra_p_1.readdir(this.buildResourcesDir).catch(e => {
            if (e.code !== "ENOENT") {
                throw e;
            }
            return [];
        });
    }
    get platform() {}
    getCscPassword() {
        const password = this.options.cscKeyPassword;
        if (password == null) {
            util_1.log("CSC_KEY_PASSWORD is not defined, empty password will be used");
            return "";
        } else {
            return password.trim();
        }
    }
    computeEffectiveTargets(rawList) {
        let targets = normalizeTargets(rawList.length === 0 ? this.customBuildOptions.target : rawList);
        if (targets != null) {
            const supportedTargets = this.supportedTargets.concat(exports.commonTargets);
            for (let target of targets) {
                if (target !== "default" && !(supportedTargets.indexOf(target) !== -1)) {
                    throw new Error(`Unknown target: ${ target }`);
                }
            }
        }
        return targets == null ? ["default"] : targets;
    }
    hasOnlyDirTarget() {
        for (let targets of this.options.targets.get(this.platform).values()) {
            for (let t of targets) {
                if (t !== "dir") {
                    return false;
                }
            }
        }
        const targets = normalizeTargets(this.customBuildOptions.target);
        return targets != null && targets.length === 1 && targets[0] === "dir";
    }
    get relativeBuildResourcesDirname() {
        return util_1.use(this.devMetadata.directories, it => it.buildResources) || "build";
    }
    get supportedTargets() {}
    computeAppOutDir(outDir, arch) {
        return path.join(outDir, `${ this.platform.buildConfigurationKey }${ arch === metadata_1.Arch.x64 ? "" : `-${ metadata_1.Arch[arch] }` }`);
    }
    dispatchArtifactCreated(file, artifactName) {
        this.info.eventEmitter.emit("artifactCreated", {
            file: file,
            artifactName: artifactName,
            platform: this.platform
        });
    }
    doPack(options, outDir, appOutDir, arch, customBuildOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const asar = options.asar;
            options.asar = false;
            yield electron_packager_tf_1.pack(options);
            options.asar = asar;
            const asarOptions = this.computeAsarOptions(customBuildOptions);
            if (asarOptions != null) {
                yield this.createAsarArchive(appOutDir, asarOptions);
            }
            yield this.copyExtraFiles(appOutDir, arch, customBuildOptions);
            const afterPack = this.devMetadata.build.afterPack;
            if (afterPack != null) {
                yield afterPack({
                    appOutDir: appOutDir,
                    options: options
                });
            }
            yield this.sanityCheckPackage(appOutDir, asarOptions != null);
        });
    }
    computePackOptions(outDir, appOutDir, arch) {
        const version = this.metadata.version;
        let buildVersion = version;
        const buildNumber = this.computeBuildNumber();
        if (buildNumber != null) {
            buildVersion += "." + buildNumber;
        }
        //noinspection JSUnusedGlobalSymbols
        const options = deepAssign({
            dir: this.info.appDir,
            out: outDir,
            name: this.appName,
            productName: this.appName,
            platform: this.platform.nodeName,
            arch: metadata_1.Arch[arch],
            version: this.info.electronVersion,
            icon: path.join(this.buildResourcesDir, "icon"),
            overwrite: true,
            "app-version": version,
            "app-copyright": `Copyright © ${ new Date().getFullYear() } ${ this.metadata.author.name || this.appName }`,
            "build-version": buildVersion,
            tmpdir: false,
            generateFinalBasename: () => path.basename(appOutDir),
            "version-string": {
                CompanyName: this.metadata.author.name,
                FileDescription: smarten(this.metadata.description),
                ProductName: this.appName,
                InternalName: this.appName
            }
        }, this.devMetadata.build);
        if (!this.info.isTwoPackageJsonProjectLayoutUsed && typeof options.ignore !== "function") {
            const defaultIgnores = ["/node_modules/electron-builder($|/)", "^/" + path.relative(this.projectDir, this.buildResourcesDir) + "($|/)"];
            if (options.ignore != null && !Array.isArray(options.ignore)) {
                options.ignore = [options.ignore];
            }
            options.ignore = options.ignore == null ? defaultIgnores : options.ignore.concat(defaultIgnores);
        }
        delete options.osx;
        delete options.win;
        delete options.linux;
        // this option only for windows-installer
        delete options.iconUrl;
        return options;
    }
    getExtraResources(isResources, arch, customBuildOptions) {
        let patterns = this.devMetadata.build[isResources ? "extraResources" : "extraFiles"];
        const platformSpecificPatterns = isResources ? customBuildOptions.extraResources : customBuildOptions.extraFiles;
        if (platformSpecificPatterns != null) {
            patterns = patterns == null ? platformSpecificPatterns : patterns.concat(platformSpecificPatterns);
        }
        return patterns == null ? bluebird_1.Promise.resolve(new Set()) : globby_1.globby(this.expandPatterns(patterns, arch), { cwd: this.projectDir });
    }
    computeAsarOptions(customBuildOptions) {
        let result = this.devMetadata.build.asar;
        let platformSpecific = customBuildOptions.asar;
        if (platformSpecific != null) {
            result = platformSpecific;
        }
        if (result === false) {
            return null;
        }
        const buildMetadata = this.devMetadata.build;
        if (buildMetadata["asar-unpack"] != null) {
            util_1.warn("asar-unpack is deprecated, please set as asar.unpack");
        }
        if (buildMetadata["asar-unpack-dir"] != null) {
            util_1.warn("asar-unpack-dir is deprecated, please set as asar.unpackDir");
        }
        if (result == null || result === true) {
            return {
                unpack: buildMetadata["asar-unpack"],
                unpackDir: buildMetadata["asar-unpack-dir"]
            };
        } else {
            return result;
        }
    }
    createAsarArchive(appOutDir, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const src = path.join(this.getResourcesDir(appOutDir), "app");
            let glob = null;
            const files = (yield new bluebird_1.Promise((resolve, reject) => {
                glob = new glob_1.Glob("**/*", {
                    cwd: src,
                    // dot: true as in the asar by default
                    dot: true,
                    ignore: "**/.DS_Store"
                }, (error, matches) => {
                    if (error == null) {
                        resolve(matches);
                    } else {
                        reject(error);
                    }
                });
            })).map(it => path.join(src, it));
            const stats = yield bluebird_1.Promise.map(files, it => {
                // const stat = glob!.statCache[it]
                // return stat == null ? lstat(it) : <any>stat
                // todo check is it safe to reuse glob stat
                return fs_extra_p_1.lstat(it);
            });
            const metadata = {};
            for (let i = 0, n = files.length; i < n; i++) {
                const stat = stats[i];
                metadata[files[i]] = {
                    type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "link",
                    stat: stat
                };
            }
            yield bluebird_1.Promise.promisify(asar_1.createPackageFromFiles)(src, path.join(this.getResourcesDir(appOutDir), "app.asar"), files, metadata, options);
            yield fs_extra_p_1.remove(src);
        });
    }
    expandPatterns(list, arch) {
        return list.map(it => it.replace(/\$\{arch}/g, metadata_1.Arch[arch]).replace(/\$\{os}/g, this.platform.buildConfigurationKey));
    }
    copyExtraFiles(appOutDir, arch, customBuildOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doCopyExtraFiles(true, appOutDir, arch, customBuildOptions);
            yield this.doCopyExtraFiles(false, appOutDir, arch, customBuildOptions);
        });
    }
    doCopyExtraFiles(isResources, appOutDir, arch, customBuildOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = isResources ? this.getResourcesDir(appOutDir) : this.platform === metadata_1.Platform.OSX ? path.join(appOutDir, `${ this.appName }.app`, "Contents") : appOutDir;
            return yield bluebird_1.Promise.map((yield this.getExtraResources(isResources, arch, customBuildOptions)), it => fs_extra_p_1.copy(path.join(this.projectDir, it), path.join(base, it)));
        });
    }
    computePackageUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.metadata.homepage || this.devMetadata.homepage;
            if (url != null) {
                return url;
            }
            if (this.info.repositoryInfo != null) {
                const info = yield this.info.repositoryInfo.getInfo(this);
                if (info != null) {
                    return `https://github.com/${ info.user }/${ info.project }`;
                }
            }
            return null;
        });
    }
    computeBuildNumber() {
        return this.devMetadata.build["build-version"] || process.env.TRAVIS_BUILD_NUMBER || process.env.APPVEYOR_BUILD_NUMBER || process.env.CIRCLE_BUILD_NUM || process.env.BUILD_NUMBER;
    }
    getResourcesDir(appOutDir) {
        return this.platform === metadata_1.Platform.OSX ? this.getOSXResourcesDir(appOutDir) : path.join(appOutDir, "resources");
    }
    getOSXResourcesDir(appOutDir) {
        return path.join(appOutDir, `${ this.appName }.app`, "Contents", "Resources");
    }
    statFileInPackage(resourcesDir, packageFile, isAsar) {
        return __awaiter(this, void 0, void 0, function* () {
            const relativeFile = path.relative(this.info.appDir, path.resolve(this.info.appDir, packageFile));
            if (isAsar) {
                try {
                    return asar_1.statFile(path.join(resourcesDir, "app.asar"), relativeFile) != null;
                } catch (e) {
                    const asarFile = path.join(resourcesDir, "app.asar");
                    const fileStat = yield util_1.statOrNull(asarFile);
                    if (fileStat == null) {
                        throw new Error(`File "${ asarFile }" does not exist. Seems like a wrong configuration.`);
                    }
                    try {
                        asar_1.listPackage(asarFile);
                    } catch (e) {
                        throw new Error(`File "${ asarFile }" is corrupted: ${ e }`);
                    }
                    // asar throws error on access to undefined object (info.link)
                    return false;
                }
            } else {
                const outStat = yield util_1.statOrNull(path.join(resourcesDir, "app", relativeFile));
                return outStat != null && outStat.isFile();
            }
        });
    }
    sanityCheckPackage(appOutDir, isAsar) {
        return __awaiter(this, void 0, void 0, function* () {
            const outStat = yield util_1.statOrNull(appOutDir);
            if (outStat == null) {
                throw new Error(`Output directory "${ appOutDir }" does not exist. Seems like a wrong configuration.`);
            } else if (!outStat.isDirectory()) {
                throw new Error(`Output directory "${ appOutDir }" is not a directory. Seems like a wrong configuration.`);
            }
            const resourcesDir = this.getResourcesDir(appOutDir);
            const mainFile = this.metadata.main || "index.js";
            const mainFileExists = yield this.statFileInPackage(resourcesDir, mainFile, isAsar);
            if (!mainFileExists) {
                throw new Error(`Application entry file ${ mainFile } could not be found in package. Seems like a wrong configuration.`);
            }
        });
    }
    archiveApp(format, appOutDir, outFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const compression = this.devMetadata.build.compression;
            const storeOnly = compression === "store";
            const dirToArchive = this.platform === metadata_1.Platform.OSX ? path.join(appOutDir, `${ this.appName }.app`) : appOutDir;
            if (format.startsWith("tar.")) {
                // we don't use 7z here - develar: I spent a lot of time making pipe working - but it works on OS X and often hangs on Linux (even if use pipe-io lib)
                // and in any case it is better to use system tools (in the light of docker - it is not problem for user because we provide complete docker image).
                const info = extToCompressionDescriptor[format];
                let tarEnv = process.env;
                if (compression != null && compression !== "normal") {
                    tarEnv = Object.assign({}, process.env);
                    tarEnv[info.env] = storeOnly ? info.minLevel : info.maxLevel;
                }
                yield util_1.spawn(process.platform === "darwin" || process.platform === "freebsd" ? "gtar" : "tar", [info.flag, "--transform", `s,^\.,${ path.basename(outFile, "." + format) },`, "-cf", outFile, "."], {
                    cwd: dirToArchive,
                    stdio: ["ignore", util_1.debug.enabled ? "inherit" : "ignore", "inherit"],
                    env: tarEnv
                });
                return;
            }
            const args = util_1.debug7zArgs("a");
            if (compression === "maximum") {
                if (format === "7z" || format.endsWith(".7z")) {
                    args.push("-mx=9", "-mfb=64", "-md=32m", "-ms=on");
                } else if (format === "zip") {
                    // http://superuser.com/a/742034
                    //noinspection SpellCheckingInspection
                    args.push("-mfb=258", "-mpass=15");
                } else {
                    args.push("-mx=9");
                }
            } else if (storeOnly) {
                if (format !== "zip") {
                    args.push("-mx=1");
                }
            }
            // remove file before - 7z doesn't overwrite file, but update
            try {
                yield fs_extra_p_1.unlink(outFile);
            } catch (e) {}
            if (format === "zip" || storeOnly) {
                args.push("-mm=" + (storeOnly ? "Copy" : "Deflate"));
            }
            args.push(outFile, dirToArchive);
            yield util_1.spawn(_7zip_bin_1.path7za, args, {
                cwd: path.dirname(dirToArchive),
                stdio: ["ignore", util_1.debug.enabled ? "inherit" : "ignore", "inherit"]
            });
        });
    }
}
exports.PlatformPackager = PlatformPackager;
function getArchSuffix(arch) {
    return arch === metadata_1.Arch.x64 ? "" : `-${ metadata_1.Arch[arch] }`;
}
exports.getArchSuffix = getArchSuffix;
function normalizeTargets(targets) {
    if (targets == null) {
        return null;
    } else {
        return (Array.isArray(targets) ? targets : [targets]).map(it => it.toLowerCase().trim());
    }
}
exports.normalizeTargets = normalizeTargets;
// fpm bug - rpm build --description is not escaped, well... decided to replace quite to smart quote
// http://leancrew.com/all-this/2010/11/smart-quotes-in-javascript/
function smarten(s) {
    // opening singles
    s = s.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");
    // closing singles & apostrophes
    s = s.replace(/'/g, "\u2019");
    // opening doubles
    s = s.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c");
    // closing doubles
    s = s.replace(/"/g, "\u201d");
    return s;
}
exports.smarten = smarten;
//# sourceMappingURL=platformPackager.js.map