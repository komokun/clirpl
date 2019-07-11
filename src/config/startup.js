const clui = require('clui')
	, Spinner = clui.Spinner
	, os = require('os')
	, Path = require('path')
	, fs = require('fs-extra')
	, through2 = require('through2')
	, Promise = require('bluebird')
	, _ = require('lodash')
	, chalk = require('chalk')
	, config = require('config')
	, URL = require('url').URL
	;

module.exports = function(CLIRPL) {

   CLIRPL.cwd = process.cwd();
   CLIRPL.dir = CLIRPL.cwd;
	CLIRPL.globalConfig = Path.join(os.homedir(), '.clirpl');
	CLIRPL.localDir = Path.join(CLIRPL.cwd, '.clirpl');

   CLIRPL.updateDelimiter = function() {
		let path = Path.relative(CLIRPL.cwd, CLIRPL.dir);
		let name = Path.basename(path) || Path.basename(CLIRPL.cwd);
		CLIRPL.vorpal
			.delimiter('CLIRPL:' + chalk.cyan(name) + ' $');
	};

   CLIRPL.updateDelimiter();

	return new Promise(function(resolve, reject) {
		var localDir;
		try {
			//localDir = fs.lstatSync(CLIRPL.localDir);
			CLIRPL.app = true;
		} catch (e) {
			if (e.code == 'ENOENT') {
				CLIRPL.app = false;
			}
		}
		resolve();
});
}