'use strict';

const exec = require('child_process').exec;
const pify = require('pify');

const f = function (cb) {
	exec('ps -e | grep -E \'.*gnome-session\'', (error, stdout) => {
		if (error) {
			cb(null, false);
		}
		if ((stdout).length > 0) {
			cb(null, true);
		}
		cb(null, false);
	});
};

module.exports = pify(f);
