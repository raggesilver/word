"use strict";

const chalk_1 = require("chalk");
const yargs = require("yargs");
function createYargs() {
    return yargs.version().option("osx", {
        alias: "o",
        describe: "Build for OS X",
        type: "array"
    }).option("linux", {
        alias: "l",
        describe: "Build for Linux",
        type: "array"
    }).option("win", {
        alias: ["w", "windows"],
        describe: "Build for Windows",
        type: "array"
    }).option("x64", {
        describe: "Build for x64",
        type: "boolean"
    }).option("ia32", {
        describe: "Build for ia32",
        type: "boolean"
    }).option("publish", {
        alias: "p",
        describe: `Publish artifacts (to GitHub Releases), see ${ chalk_1.underline("https://goo.gl/WMlr4n") }`,
        choices: ["onTag", "onTagOrDraft", "always", "never"]
    }).option("platform", {
        choices: ["osx", "win", "linux", "darwin", "win32", "all"]
    }).option("arch", {
        choices: ["ia32", "x64", "all"]
    }).strict().help().epilog(`Project home: ${ chalk_1.underline("https://github.com/electron-userland/electron-builder") }`);
}
exports.createYargs = createYargs;
//# sourceMappingURL=cliOptions.js.map