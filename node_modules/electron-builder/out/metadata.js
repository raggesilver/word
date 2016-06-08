"use strict";

class Platform {
    constructor(name, buildConfigurationKey, nodeName) {
        this.name = name;
        this.buildConfigurationKey = buildConfigurationKey;
        this.nodeName = nodeName;
    }
    toString() {
        return this.name;
    }
    toJSON() {
        return this.name;
    }
    createTarget(type) {
        const archToType = new Map();

        for (var _len = arguments.length, archs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            archs[_key - 1] = arguments[_key];
        }

        for (let arch of archs == null || archs.length === 0 ? [archFromString(process.arch)] : archs) {
            archToType.set(arch, type == null ? [] : [type]);
        }
        return new Map([[this, archToType]]);
    }
    static current() {
        return Platform.fromString(process.platform);
    }
    static fromString(name) {
        switch (name) {
            case Platform.OSX.nodeName:
            case Platform.OSX.name:
                return Platform.OSX;
            case Platform.WINDOWS.nodeName:
            case Platform.WINDOWS.name:
            case Platform.WINDOWS.buildConfigurationKey:
                return Platform.WINDOWS;
            case Platform.LINUX.nodeName:
                return Platform.LINUX;
        }
        throw new Error("Unknown platform: " + name);
    }
}
Platform.OSX = new Platform("osx", "osx", "darwin");
Platform.LINUX = new Platform("linux", "linux", "linux");
Platform.WINDOWS = new Platform("windows", "win", "win32");
exports.Platform = Platform;
(function (Arch) {
    Arch[Arch["ia32"] = 0] = "ia32";
    Arch[Arch["x64"] = 1] = "x64";
})(exports.Arch || (exports.Arch = {}));
var Arch = exports.Arch;
function archFromString(name) {
    if (name === "x64") {
        return Arch.x64;
    }
    if (name === "ia32") {
        return Arch.ia32;
    }
    throw new Error(`Unsupported arch ${ name }`);
}
exports.archFromString = archFromString;
function getProductName(metadata, devMetadata) {
    return devMetadata.build.productName || metadata.productName || metadata.name;
}
exports.getProductName = getProductName;
//# sourceMappingURL=metadata.js.map