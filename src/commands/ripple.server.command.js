var _ = require('lodash');

import { RippleServerInfoPretty } from '../pretty/ripple.server_info.pretty';

module.exports = function(CLIRPL) {
	
	CLIRPL.vorpal
      .command('fee', 'Current state of the open-ledger requirements for the transaction cost.')
      .option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Getting transaction fees requirements for ledger at ${CLIRPL.ledger_endpoint}`).start();
			
         await CLIRPL.wsconnection.send({ command: 'fee' })
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleServerInfoPretty.fee(result);
         })
   		callback();
   });

   CLIRPL.vorpal
		.command('server info', 'Ripple server human-readable version of various information.')
		.alias('info')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying human-readable ledger information...`).start();
			
			await CLIRPL.wsconnection.send({ command: 'server_info' })
         .then((result) => {
				let info = result.info;
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(info)}`) 
						: RippleServerInfoPretty.info(info);
         })
   		callback();
	});

   CLIRPL.vorpal
      .command('server state', 'Rippled server machine-readable version of various information.')
      .alias('state')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying machine-readable ledger information...`).start();
			
			await CLIRPL.wsconnection.send({ command: 'server_state' })
         .then((data) => {
				CLIRPL.spinner.stop();
				CLIRPL.logger.info(`${JSON.stringify(data)}`) 
         })
   		callback();
	});

	return new Promise(function(resolve, reject) {
		resolve();
	});
}