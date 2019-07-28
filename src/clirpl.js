const vorpal = require('vorpal')()
	, chalk = require('chalk')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, _ = require('lodash')
	, parseArgs = require('minimist')
;

var ora = require('ora');

var CLIRPL = {
	argv: parseArgs(process.argv.slice(2), {
		alias: {
			'p': 'port'
		}
	})
};

const ledger = 'devledger'
CLIRPL.vorpal = vorpal;
CLIRPL.spinner = ora();
var spinner = new Spinner('Starting Ripple Command Line Application...');
spinner.start();

/*
const LedgerTransaction     = require('./api/xrpl.transaction');
const payment_fixtures      = require('../tests/fixtures/payment.json');

const c = async() => {

	let native_payment = payment_fixtures.native;

	let params  = { message: native_payment.content, object: null, 
										vault: null, xrpl: null, 
											validators: null, errors: [] };
	let transaction = new LedgerTransaction(params);
	console.log(await transaction.validate());
}

c();
*/
require('./common/utils.js')(CLIRPL)
.then(() => {
	CLIRPL.logger.info('Starting Ripple Command Line Application...')
	spinner.message(`Starting/Connecting to wallet key vault...`);
	return require('./config/startup.js')(CLIRPL)})
.then(() => {
	spinner.message(`Starting/Connecting to wallet key vault...`);
	return require('./config/vault.js')(CLIRPL)})
.then(() => {
	spinner.message(`Establishing a connection to XRP ledger ${ledger}...`);
	return require('./config/ledger.ws.js')(CLIRPL)})
.finally( async () => {
	spinner.stop();
	/*Connect to a ripple ledger*/ 
	CLIRPL.logger.warn(`XRP ledger endpoint is ${CLIRPL.ledger_endpoint}`);
	await CLIRPL.wsServer.connect();
	if(CLIRPL.wsServer.online){
		CLIRPL.logger.confirm(`XRP ledger endpoint is ready for use.`);
	} else {
		CLIRPL.logger.error(`XRP ledger endpoint is offline.`);
	}
	
	/*Connect to key vault*/ 
	CLIRPL.logger.warn(`Keys endpoint is ${CLIRPL.vault_endpoint}.`);
	await CLIRPL.vaultServer.ping();
	if(CLIRPL.vaultServer.online){
		CLIRPL.logger.confirm(`Keys endpoint is online and ready for use.`);
	} else {
		CLIRPL.logger.error(`Keys endpoint is offline.`);
	}

	vorpal.show();
}).catch((e) => {
	spinner.stop();
	CLIRPL.logger.error(e);
	vorpal.show();
})
;

require('./commands/xrplkd.commands')(CLIRPL);
require('./commands/ripple.account.command')(CLIRPL);
require('./commands/ripple.utility.command')(CLIRPL);
require('./commands/ripple.server.command')(CLIRPL);
require('./commands/ripple.transactions.command')(CLIRPL);

vorpal.find('exit').description('Exit Ripple CLI');

vorpal.ui._sigint = function() {
	process.exit(0);
};

process.on('exit', function(code) {
	CLIRPL.logger.confirm('Exit Ripple CLI.');
});

process.on('uncaughtException', function(err) {
	console.error(err);
});