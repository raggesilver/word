#! /usr/bin/env node

"use strict";

const builder_1 = require("./builder");
const promise_1 = require("./promise");
const cliOptions_1 = require("./cliOptions");
builder_1.build(cliOptions_1.createYargs().argv).catch(promise_1.printErrorAndExit);
//# sourceMappingURL=build-cli.js.map