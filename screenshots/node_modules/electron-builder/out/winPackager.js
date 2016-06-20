"use strict";

const codeSign_1 = require("./codeSign");
const bluebird_1 = require("bluebird");
const platformPackager_1 = require("./platformPackager");
const metadata_1 = require("./metadata");
const path = require("path");
const util_1 = require("./util");
const fs_extra_p_1 = require("fs-extra-p");
const signcode_tf_1 = require("signcode-tf");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
class WinPackager extends platformPackager_1.PlatformPackager {
    constructor(info, cleanupTasks) {
        super(info);
        const certificateFile = this.customBuildOptions.certificateFile;
        if (certificateFile != null) {
            const certificatePassword = this.customBuildOptions.certificatePassword || this.getCscPassword();
            this.cscInfo = bluebird_1.Promise.resolve({
                file: certificateFile,
                password: certificatePassword == null ? null : certificatePassword.trim()
            });
        } else if (this.options.cscLink != null) {
            this.cscInfo = codeSign_1.downloadCertificate(this.options.cscLink).then(path => {
                cleanupTasks.push(() => fs_extra_p_1.deleteFile(path, true));
                return {
                    file: path,
                    password: this.getCscPassword()
                };
            });
        } else {
            this.cscInfo = bluebird_1.Promise.resolve(null);
        }
        this.iconPath = this.getValidIconPath();
    }
    get platform() {
        return metadata_1.Platform.WINDOWS;
    }
    get supportedTargets() {
        return [];
    }
    getValidIconPath() {
        return __awaiter(this, void 0, void 0, function* () {
            const iconPath = path.join(this.buildResourcesDir, "icon.ico");
            yield checkIcon(iconPath);
            return iconPath;
        });
    }
    pack(outDir, arch, targets, postAsyncTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (arch === metadata_1.Arch.ia32) {
                util_1.warn("For windows consider only distributing 64-bit, see https://github.com/electron-userland/electron-builder/issues/359#issuecomment-214851130");
            }
            // we must check icon before pack because electron-packager uses icon and it leads to cryptic error message "spawn wine ENOENT"
            yield this.iconPath;
            const appOutDir = this.computeAppOutDir(outDir, arch);
            const packOptions = this.computePackOptions(outDir, appOutDir, arch);
            if (!(targets.indexOf("default") !== -1)) {
                yield this.doPack(packOptions, outDir, appOutDir, arch, this.customBuildOptions);
                return;
            }
            const installerOut = computeDistOut(outDir, arch);
            yield bluebird_1.Promise.all([this.doPack(packOptions, outDir, appOutDir, arch, this.customBuildOptions), fs_extra_p_1.emptyDir(installerOut)]);
            postAsyncTasks.push(this.packageInDistributableFormat(appOutDir, installerOut, arch, packOptions));
        });
    }
    computeAppOutDir(outDir, arch) {
        return path.join(outDir, `win${ platformPackager_1.getArchSuffix(arch) }-unpacked`);
    }
    doPack(options, outDir, appOutDir, arch, customBuildOptions) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("doPack").call(this, options, outDir, appOutDir, arch, customBuildOptions);
            yield this.sign(appOutDir);
        });
    }
    sign(appOutDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const cscInfo = yield this.cscInfo;
            if (cscInfo != null) {
                const filename = `${ this.appName }.exe`;
                util_1.log(`Signing ${ filename } (certificate file "${ cscInfo.file }")`);
                yield this.doSign({
                    path: path.join(appOutDir, filename),
                    cert: cscInfo.file,
                    password: cscInfo.password,
                    name: this.appName,
                    site: yield this.computePackageUrl(),
                    overwrite: true,
                    hash: this.customBuildOptions.signingHashAlgorithms
                });
            }
        });
    }
    doSign(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return bluebird_1.Promise.promisify(signcode_tf_1.sign)(opts);
        });
    }
    computeEffectiveDistOptions(appOutDir, installerOutDir, packOptions, setupExeName) {
        return __awaiter(this, void 0, void 0, function* () {
            let iconUrl = this.customBuildOptions.iconUrl || this.devMetadata.build.iconUrl;
            if (iconUrl == null) {
                if (this.info.repositoryInfo != null) {
                    const info = yield this.info.repositoryInfo.getInfo(this);
                    if (info != null) {
                        iconUrl = `https://github.com/${ info.user }/${ info.project }/blob/master/${ this.relativeBuildResourcesDirname }/icon.ico?raw=true`;
                    }
                }
                if (iconUrl == null) {
                    throw new Error("iconUrl is not specified, please see https://github.com/electron-userland/electron-builder/wiki/Options#WinBuildOptions-iconUrl");
                }
            }
            checkConflictingOptions(this.customBuildOptions);
            const projectUrl = yield this.computePackageUrl();
            const rceditOptions = {
                "version-string": packOptions["version-string"],
                "file-version": packOptions["build-version"],
                "product-version": packOptions["app-version"]
            };
            rceditOptions["version-string"].LegalCopyright = packOptions["app-copyright"];
            const cscInfo = yield this.cscInfo;
            const options = Object.assign({
                name: this.metadata.name,
                productName: this.appName,
                exe: this.appName + ".exe",
                setupExe: setupExeName,
                title: this.appName,
                appDirectory: appOutDir,
                outputDirectory: installerOutDir,
                version: this.metadata.version,
                description: platformPackager_1.smarten(this.metadata.description),
                authors: this.metadata.author.name,
                iconUrl: iconUrl,
                setupIcon: yield this.iconPath,
                certificateFile: cscInfo == null ? null : cscInfo.file,
                certificatePassword: cscInfo == null ? null : cscInfo.password,
                fixUpPaths: false,
                skipUpdateIcon: true,
                usePackageJson: false,
                extraMetadataSpecs: projectUrl == null ? null : `\n    <projectUrl>${ projectUrl }</projectUrl>`,
                copyright: packOptions["app-copyright"],
                packageCompressionLevel: this.devMetadata.build.compression === "store" ? 0 : 9,
                sign: {
                    name: this.appName,
                    site: projectUrl,
                    overwrite: true,
                    hash: this.customBuildOptions.signingHashAlgorithms
                },
                rcedit: rceditOptions
            }, this.customBuildOptions);
            if (!("loadingGif" in options)) {
                const resourceList = yield this.resourceList;
                if (resourceList.indexOf("install-spinner.gif") !== -1) {
                    options.loadingGif = path.join(this.buildResourcesDir, "install-spinner.gif");
                }
            }
            return options;
        });
    }
    packageInDistributableFormat(appOutDir, installerOutDir, arch, packOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const winstaller = require("electron-winstaller-fixed");
            const version = this.metadata.version;
            const archSuffix = platformPackager_1.getArchSuffix(arch);
            const setupExeName = `${ this.appName } Setup ${ version }${ archSuffix }.exe`;
            const distOptions = yield this.computeEffectiveDistOptions(appOutDir, installerOutDir, packOptions, setupExeName);
            yield winstaller.createWindowsInstaller(distOptions);
            this.dispatchArtifactCreated(path.join(installerOutDir, setupExeName), `${ this.metadata.name }-Setup-${ version }${ archSuffix }.exe`);
            const packagePrefix = `${ this.metadata.name }-${ winstaller.convertVersion(version) }-`;
            this.dispatchArtifactCreated(path.join(installerOutDir, `${ packagePrefix }full.nupkg`));
            if (distOptions.remoteReleases != null) {
                this.dispatchArtifactCreated(path.join(installerOutDir, `${ packagePrefix }delta.nupkg`));
            }
            this.dispatchArtifactCreated(path.join(installerOutDir, "RELEASES"));
        });
    }
}
exports.WinPackager = WinPackager;
function checkIcon(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fs_extra_p_1.open(file, "r");
        const buffer = new Buffer(512);
        try {
            yield fs_extra_p_1.read(fd, buffer, 0, buffer.length, 0);
        } finally {
            yield fs_extra_p_1.close(fd);
        }
        if (!isIco(buffer)) {
            throw new Error(`Windows icon is not valid ico file, please fix "${ file }"`);
        }
        const sizes = parseIco(buffer);
        for (let size of sizes) {
            if (size.w >= 256 && size.h >= 256) {
                return;
            }
        }
        throw new Error(`Windows icon size must be at least 256x256, please fix "${ file }"`);
    });
}
function parseIco(buffer) {
    if (!isIco(buffer)) {
        throw new Error("buffer is not ico");
    }
    const n = buffer.readUInt16LE(4);
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = {
            w: buffer.readUInt8(6 + i * 16) || 256,
            h: buffer.readUInt8(7 + i * 16) || 256
        };
    }
    return result;
}
function isIco(buffer) {
    return buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1;
}
function computeDistOut(outDir, arch) {
    return path.join(outDir, `win${ platformPackager_1.getArchSuffix(arch) }`);
}
exports.computeDistOut = computeDistOut;
function checkConflictingOptions(options) {
    for (let name of ["outputDirectory", "appDirectory", "exe", "fixUpPaths", "usePackageJson", "extraFileSpecs", "extraMetadataSpecs", "skipUpdateIcon", "setupExe"]) {
        if (name in options) {
            throw new Error(`Option ${ name } is ignored, do not specify it.`);
        }
    }
    if ("noMsi" in options) {
        util_1.warn(`noMsi is deprecated, please specify as "msi": true if you want to create an MSI installer`);
        options.msi = !options.noMsi;
    }
    const msi = options.msi;
    if (msi != null && typeof msi !== "boolean") {
        throw new Error(`msi expected to be boolean value, but string '"${ msi }"' was specified`);
    }
}
//# sourceMappingURL=winPackager.js.map