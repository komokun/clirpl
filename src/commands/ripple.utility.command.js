var _ = require('lodash');

import { RippleUtilityPretty } from '../pretty/ripple.utility.pretty';

module.exports = function(CLIRPL) {
	
	CLIRPL.vorpal
      .command('ping ledger', 'Ping the ripple ledger. Defaults to XRP live ledger.')
      .alias('ping')
      .alias('is ledger online?')
      .option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Attempting to ping ledger at ${CLIRPL.ledger_endpoint}`).start();
			
         await CLIRPL.wsconnection.send({ command: 'ping' })
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleUtilityPretty.ping(result.status);
         })
   		callback();
   });

   CLIRPL.vorpal
		.command('random', 'Provide a random number. To use as entropy')
		.alias('entrophy')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for entrophy`).start();
			
			await CLIRPL.wsconnection.send({ command: 'random' })
         .then((data) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(data)}`) 
						: RippleUtilityPretty.random(data.random);
         })
   		callback();
	});

	
	return new Promise(function(resolve, reject) {
		resolve();
	});
}