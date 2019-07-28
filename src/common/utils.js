const shell = require('shelljs')
	, console2 = require('console2')({disableWelcome: true, override: false})
	, Promise = require('bluebird')
	;

shell.log = function() {
	CLIRPL.logger.info.apply(this, arguments);
};

module.exports = function(CLIRPL) {

	CLIRPL.shell = shell;
	CLIRPL.console2 = console2;

	CLIRPL.logger = {
		log: function(msg) {
			console2.log(msg);
		},
		info: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			console2.log(msg);
		},
		error: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			if (typeof msg === 'object') msg = msg.toString();
			console2.error(msg);
		},
		warn: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			console2.warn(msg);
		},
		confirm: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			console2.info(msg)
		},
		object: function(obj) {
			var root = console2.box();

			function traverse(obj, prev) {
				var box = prev.box();
				for (var key in obj) {
					if (typeof obj[key] === 'object') {
						box.line(chalk.cyan(key));
						traverse(obj[key], box);
					}
					else if (typeof  obj[key] === 'array') {
						for (var i in obj[key]) traverse(obj[key], box)
					}
					else box.line(key + ': ' + obj[key])
				}
				box.over();
				return prev;
			}

			traverse(obj, root).out();
		}
	};

	console.log = function(msg) {
		CLIRPL.logger.info(msg);
	};

	return new Promise(function(resolve, reject) {
		resolve();
	});
};