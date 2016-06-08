"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const path = require("path");
const bluebird_1 = require("bluebird");
const platformPackager_1 = require("./platformPackager");
const metadata_1 = require("./metadata");
const util_1 = require("./util");
const fs_extra_p_1 = require("fs-extra-p");
const fpmDownload_1 = require("./fpmDownload");
const os_1 = require("os");
const template = require("lodash.template");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
const installPrefix = "/opt";
class LinuxPackager extends platformPackager_1.PlatformPackager {
    constructor(info, cleanupTasks) {
        super(info);
        this.buildOptions = Object.assign({
            name: this.metadata.name,
            description: this.metadata.description
        }, this.customBuildOptions);
        if (!this.hasOnlyDirTarget()) {
            const tempDir = path.join(os_1.tmpdir(), util_1.getTempName("electron-builder-linux"));
            const tempDirPromise = fs_extra_p_1.emptyDir(tempDir).then(() => {
                cleanupTasks.push(() => fs_extra_p_1.remove(tempDir));
                return tempDir;
            });
            this.packageFiles = this.computePackageFiles(tempDirPromise);
            this.scriptFiles = this.createScripts(tempDirPromise);
            if (process.platform === "win32" || process.env.USE_SYSTEM_FPM === "true") {
                this.fpmPath = bluebird_1.Promise.resolve("fpm");
            } else {
                this.fpmPath = fpmDownload_1.downloadFpm(process.platform === "darwin" ? "1.5.1-20150715-2.2.2" : "1.5.0-2.3.1", process.platform === "darwin" ? "osx" : `linux-x86${ process.arch === "ia32" ? "" : "_64" }`);
            }
        }
    }
    get supportedTargets() {
        return ["deb", "rpm", "sh", "freebsd", "pacman", "apk", "p5p"];
    }
    get platform() {
        return metadata_1.Platform.LINUX;
    }
    computePackageFiles(tempDirPromise) {
        return __awaiter(this, void 0, void 0, function* () {
            var _ref;

            const tempDir = yield tempDirPromise;
            const promises = [];
            if (this.customBuildOptions.desktop == null) {
                promises.push(this.computeDesktopIconPath(tempDir));
            }
            promises.push(this.computeDesktop(tempDir));
            return (_ref = []).concat.apply(_ref, _toConsumableArray((yield bluebird_1.Promise.all(promises))));
        });
    }
    pack(outDir, arch, targets, postAsyncTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            const appOutDir = this.computeAppOutDir(outDir, arch);
            yield this.doPack(this.computePackOptions(outDir, appOutDir, arch), outDir, appOutDir, arch, this.customBuildOptions);
            postAsyncTasks.push(this.packageInDistributableFormat(outDir, appOutDir, arch, targets));
        });
    }
    computeDesktop(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempFile = path.join(tempDir, this.appName + ".desktop");
            yield fs_extra_p_1.outputFile(tempFile, this.buildOptions.desktop || `[Desktop Entry]
Name=${ this.appName }
Comment=${ this.buildOptions.description }
Exec="${ installPrefix }/${ this.appName }/${ this.appName }"
Terminal=false
Type=Application
Icon=${ this.metadata.name }
`);
            return [`${ tempFile }=/usr/share/applications/${ this.appName }.desktop`];
        });
    }
    // must be name without spaces and other special characters, but not product name used
    computeDesktopIconPath(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mappings = [];
                const pngIconsDir = path.join(this.buildResourcesDir, "icons");
                for (let file of yield fs_extra_p_1.readdir(pngIconsDir)) {
                    if (file.endsWith(".png") || file.endsWith(".PNG")) {
                        // If parseInt encounters a character that is not a numeral in the specified radix,
                        // it returns the integer value parsed up to that point
                        try {
                            const size = parseInt(file, 10);
                            if (size > 0) {
                                mappings.push(`${ pngIconsDir }/${ file }=/usr/share/icons/hicolor/${ size }x${ size }/apps/${ this.metadata.name }.png`);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
                return mappings;
            } catch (e) {
                return this.createFromIcns(tempDir);
            }
        });
    }
    createFromIcns(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = yield util_1.exec("icns2png", ["-x", "-o", tempDir, path.join(this.buildResourcesDir, "icon.icns")]);
            util_1.debug(output);
            const imagePath = path.join(tempDir, "icon_256x256x32.png");
            function resize(size) {
                const sizeArg = `${ size }x${ size }`;
                return util_1.exec("gm", ["convert", "-size", sizeArg, imagePath, "-resize", sizeArg, path.join(tempDir, `icon_${ size }x${ size }x32.png`)]);
            }
            const promises = [resize(24), resize(96)];
            if (!(output.indexOf("is32") !== -1)) {
                promises.push(resize(16));
            }
            if (!(output.indexOf("ih32") !== -1)) {
                promises.push(resize(48));
            }
            if (!(output.toString().indexOf("icp6") !== -1)) {
                promises.push(resize(64));
            }
            if (!(output.indexOf("it32") !== -1)) {
                promises.push(resize(128));
            }
            yield bluebird_1.Promise.all(promises);
            const appName = this.metadata.name;
            function createMapping(size) {
                return `${ tempDir }/icon_${ size }x${ size }x32.png=/usr/share/icons/hicolor/${ size }x${ size }/apps/${ appName }.png`;
            }
            return [createMapping("16"), createMapping("24"), createMapping("32"), createMapping("48"), createMapping("64"), createMapping("96"), createMapping("128"), createMapping("256"), createMapping("512")];
        });
    }
    createScripts(tempDirPromise) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempDir = yield tempDirPromise;
            const defaultTemplatesDir = path.join(__dirname, "..", "templates", "linux");
            const templateOptions = Object.assign({
                // old API compatibility
                executable: this.appName
            }, this.buildOptions);
            const afterInstallTemplate = this.buildOptions.afterInstall || path.join(defaultTemplatesDir, "after-install.tpl");
            const afterInstallFilePath = writeConfigFile(tempDir, afterInstallTemplate, templateOptions);
            const afterRemoveTemplate = this.buildOptions.afterRemove || path.join(defaultTemplatesDir, "after-remove.tpl");
            const afterRemoveFilePath = writeConfigFile(tempDir, afterRemoveTemplate, templateOptions);
            return yield bluebird_1.Promise.all([afterInstallFilePath, afterRemoveFilePath]);
        });
    }
    packageInDistributableFormat(outDir, appOutDir, arch, targets) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo fix fpm - if run in parallel, get strange tar errors
            for (let target of targets) {
                target = target === "default" ? "deb" : target;
                if (target !== "dir" && target !== "zip" && target !== "7z" && !target.startsWith("tar.")) {
                    const destination = path.join(outDir, `${ this.metadata.name }-${ this.metadata.version }${ platformPackager_1.getArchSuffix(arch) }.${ target }`);
                    yield this.buildPackage(destination, target, this.buildOptions, appOutDir, arch);
                    this.dispatchArtifactCreated(destination);
                }
            }
            const promises = [];
            // https://github.com/electron-userland/electron-builder/issues/460
            // for some reasons in parallel to fmp we cannot use tar
            for (let target of targets) {
                if (target === "zip" || target === "7z" || target.startsWith("tar.")) {
                    const destination = path.join(outDir, `${ this.metadata.name }-${ this.metadata.version }${ platformPackager_1.getArchSuffix(arch) }.${ target }`);
                    promises.push(this.archiveApp(target, appOutDir, destination).then(() => this.dispatchArtifactCreated(destination)));
                }
            }
            if (promises.length > 0) {
                yield bluebird_1.Promise.all(promises);
            }
        });
    }
    buildPackage(destination, target, options, appOutDir, arch) {
        return __awaiter(this, void 0, void 0, function* () {
            const scripts = yield this.scriptFiles;
            const projectUrl = yield this.computePackageUrl();
            if (projectUrl == null) {
                throw new Error("Please specify project homepage, see https://github.com/electron-userland/electron-builder/wiki/Options#AppMetadata-homepage");
            }
            const author = options.maintainer || `${ this.metadata.author.name } <${ this.metadata.author.email }>`;
            const synopsis = options.synopsis;
            const args = ["-s", "dir", "-t", target, "--architecture", arch === metadata_1.Arch.ia32 ? "i386" : "amd64", "--name", this.metadata.name, "--force", "--after-install", scripts[0], "--after-remove", scripts[1], "--description", platformPackager_1.smarten(target === "rpm" ? this.buildOptions.description : `${ synopsis || "" }\n ${ this.buildOptions.description }`), "--maintainer", author, "--vendor", options.vendor || author, "--version", this.metadata.version, "--package", destination, "--url", projectUrl];
            if (target === "deb") {
                args.push("--deb-compression", options.compression || (this.devMetadata.build.compression === "store" ? "gz" : "xz"));
            } else if (target === "rpm") {
                // args.push("--rpm-compression", options.compression || (this.devMetadata.build.compression === "store" ? "none" : "xz"))
                args.push("--rpm-os", "linux");
                if (synopsis != null) {
                    args.push("--rpm-summary", platformPackager_1.smarten(synopsis));
                }
            }
            let depends = options.depends;
            if (depends == null) {
                depends = ["libappindicator1", "libnotify-bin"];
            } else if (!Array.isArray(depends)) {
                if (typeof depends === "string") {
                    depends = [depends];
                } else {
                    throw new Error(`depends must be Array or String, but specified as: ${ depends }`);
                }
            }
            for (let dep of depends) {
                args.push("--depends", dep);
            }
            util_1.use(this.metadata.license || this.devMetadata.license, it => args.push("--license", it));
            util_1.use(this.computeBuildNumber(), it => args.push("--iteration", it));
            util_1.use(options.fpm, it => args.push.apply(args, _toConsumableArray(it)));
            args.push(`${ appOutDir }/=${ installPrefix }/${ this.appName }`);
            args.push.apply(args, _toConsumableArray((yield this.packageFiles)));
            yield util_1.exec((yield this.fpmPath), args);
        });
    }
}
exports.LinuxPackager = LinuxPackager;
function writeConfigFile(tempDir, templatePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = template((yield fs_extra_p_1.readFile(templatePath, "utf8")), {
            // set interpolate explicitly to avoid troubles with templating of installer.nsi.tpl
            interpolate: /<%=([\s\S]+?)%>/g
        })(options);
        const outputPath = path.join(tempDir, path.basename(templatePath, ".tpl"));
        yield fs_extra_p_1.outputFile(outputPath, config);
        return outputPath;
    });
}
//# sourceMappingURL=linuxPackager.js.map