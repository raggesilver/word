"use strict";

const child_process_1 = require("child_process");
const bluebird_1 = require("bluebird");
const readPackageJsonAsync = require("read-package-json");
const os = require("os");
const path = require("path");
const fs_extra_p_1 = require("fs-extra-p");
const chalk_1 = require("chalk");
const debugFactory = require("debug");
//noinspection JSUnusedLocalSymbols
const __awaiter = require("./awaiter");
exports.log = console.log;
exports.debug = debugFactory("electron-builder");
exports.debug7z = debugFactory("electron-builder:7z");
function warn(message) {
    console.warn(chalk_1.yellow(`Warning: ${ message }`));
}
exports.warn = warn;
const DEFAULT_APP_DIR_NAMES = ["app", "www"];
exports.readPackageJson = bluebird_1.Promise.promisify(readPackageJsonAsync);
function installDependencies(appDir, electronVersion) {
    let arch = arguments.length <= 2 || arguments[2] === undefined ? process.arch : arguments[2];
    let command = arguments.length <= 3 || arguments[3] === undefined ? "install" : arguments[3];

    exports.log((command === "install" ? "Installing" : "Rebuilding") + " app dependencies for arch %s to %s", arch, appDir);
    const gypHome = path.join(os.homedir(), ".electron-gyp");
    const env = Object.assign({}, process.env, {
        npm_config_disturl: "https://atom.io/download/atom-shell",
        npm_config_target: electronVersion,
        npm_config_runtime: "electron",
        npm_config_arch: arch,
        HOME: gypHome,
        USERPROFILE: gypHome
    });
    let npmExecPath = process.env.npm_execpath || process.env.NPM_CLI_JS;
    const npmExecArgs = [command, "--production"];
    if (npmExecPath == null) {
        npmExecPath = process.platform === "win32" ? "npm.cmd" : "npm";
    } else {
        npmExecArgs.unshift(npmExecPath);
        npmExecPath = process.env.npm_node_execpath || process.env.NODE_EXE || "node";
    }
    return spawn(npmExecPath, npmExecArgs, {
        cwd: appDir,
        stdio: "inherit",
        env: env
    });
}
exports.installDependencies = installDependencies;
function exec(file, args, options) {
    if (exports.debug.enabled) {
        exports.debug(`Executing ${ file } ${ args == null ? "" : args.join(" ") }`);
    }
    return new bluebird_1.Promise((resolve, reject) => {
        child_process_1.execFile(file, args, options, function (error, stdout, stderr) {
            if (error == null) {
                resolve(stdout);
            } else {
                if (stdout.length !== 0) {
                    console.log(stdout.toString());
                }
                if (stderr.length === 0) {
                    reject(error);
                } else {
                    reject(new Error(stderr.toString() + "\n" + error.toString()));
                }
            }
        });
    });
}
exports.exec = exec;
function doSpawn(command, args, options) {
    if (exports.debug.enabled) {
        exports.debug(`Spawning ${ command } ${ args.join(" ") }`);
    }
    return child_process_1.spawn(command, args, options);
}
exports.doSpawn = doSpawn;
function spawn(command, args, options) {
    return new bluebird_1.Promise((resolve, reject) => {
        const notNullArgs = args || [];
        const childProcess = doSpawn(command, notNullArgs, options);
        handleProcess("close", childProcess, command, resolve, reject);
    });
}
exports.spawn = spawn;
function handleProcess(event, childProcess, command, resolve, reject) {
    childProcess.on("error", reject);
    childProcess.on(event, code => {
        if (exports.debug.enabled) {
            exports.debug(`${ command } (${ childProcess.pid }) exited with code ${ code }`);
        }
        if (code !== 0) {
            reject(new Error(`${ command } exited with code ${ code }`));
        } else if (resolve != null) {
            resolve();
        }
    });
}
exports.handleProcess = handleProcess;
function getElectronVersion(packageData, packageJsonPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const build = packageData.build;
        // build is required, but this check is performed later, so, we should check for null
        if (build != null && build.electronVersion != null) {
            return build.electronVersion;
        }
        try {
            return (yield fs_extra_p_1.readJson(path.join(path.dirname(packageJsonPath), "node_modules", "electron-prebuilt", "package.json"))).version;
        } catch (e) {
            if (e.code !== "ENOENT") {
                warn("Cannot read electron version from electron-prebuilt package.json" + e.message);
            }
        }
        const electronPrebuiltDep = findFromElectronPrebuilt(packageData);
        if (electronPrebuiltDep == null) {
            throw new Error("Cannot find electron-prebuilt dependency to get electron version in the '" + packageJsonPath + "'");
        }
        const firstChar = electronPrebuiltDep[0];
        return firstChar === "^" || firstChar === "~" ? electronPrebuiltDep.substring(1) : electronPrebuiltDep;
    });
}
exports.getElectronVersion = getElectronVersion;
function findFromElectronPrebuilt(packageData) {
    for (let name of ["electron-prebuilt", "electron-prebuilt-compile"]) {
        const devDependencies = packageData.devDependencies;
        let electronPrebuiltDep = devDependencies == null ? null : devDependencies[name];
        if (electronPrebuiltDep == null) {
            const dependencies = packageData.dependencies;
            electronPrebuiltDep = dependencies == null ? null : dependencies[name];
        }
        if (electronPrebuiltDep != null) {
            return electronPrebuiltDep;
        }
    }
    return null;
}
function statOrNull(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fs_extra_p_1.stat(file);
        } catch (e) {
            if (e.code === "ENOENT") {
                return null;
            } else {
                throw e;
            }
        }
    });
}
exports.statOrNull = statOrNull;
function computeDefaultAppDirectory(projectDir, userAppDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userAppDir != null) {
            const absolutePath = path.join(projectDir, userAppDir);
            const stat = yield statOrNull(absolutePath);
            if (stat == null) {
                throw new Error(`Application directory ${ userAppDir } doesn't exists`);
            } else if (!stat.isDirectory()) {
                throw new Error(`Application directory ${ userAppDir } is not a directory`);
            }
            return absolutePath;
        }
        for (let dir of DEFAULT_APP_DIR_NAMES) {
            const absolutePath = path.join(projectDir, dir);
            const stat = yield statOrNull(absolutePath);
            if (stat != null && stat.isDirectory()) {
                return absolutePath;
            }
        }
        return projectDir;
    });
}
exports.computeDefaultAppDirectory = computeDefaultAppDirectory;
function use(value, task) {
    return value == null ? null : task(value);
}
exports.use = use;
function debug7zArgs(command) {
    const args = [command, "-bd"];
    if (exports.debug7z.enabled) {
        args.push("-bb3");
    } else if (!exports.debug.enabled) {
        args.push("-bb0");
    }
    return args;
}
exports.debug7zArgs = debug7zArgs;
let tmpDirCounter = 0;
// add date to avoid use stale temp dir
const tempDirPrefix = `${ process.pid.toString(36) }-${ Date.now().toString(36) }`;
function getTempName(prefix) {
    return `${ prefix == null ? "" : prefix + "-" }${ tempDirPrefix }-${ (tmpDirCounter++).toString(36) }`;
}
exports.getTempName = getTempName;
function isEmptyOrSpaces(s) {
    return s == null || s.trim().length === 0;
}
exports.isEmptyOrSpaces = isEmptyOrSpaces;
//# sourceMappingURL=util.js.map