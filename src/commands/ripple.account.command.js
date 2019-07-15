var _ = require('lodash');

import { RippleAccountPretty } from '../pretty/ripple.account.pretty'

module.exports = function(CLIRPL) {
	
	CLIRPL.vorpal
		.command('account balance [address]', 'Open ledger requirement for transaction cost.')
		.alias('balance [address]')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for ledger transaction fees`).start();
			
			// await CLIRPL.ripple.getBalances(args.address)
			await CLIRPL.wsconnection.send({ command: 'server_info' })
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.balances(result);
         })
   		callback();
	});
	
	CLIRPL.vorpal
		.command('account [address]', 'Return information on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for information on account ${args.address}`).start();
			 
			await CLIRPL.wsconnection.send({ id: 2, command: 'account_info',
														account: args.address,
														strict: true,
														ledger_index: "current",
														queue: true
													})
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result.account_data)}`) 
						: RippleAccountPretty.info(result.account_data);
         })
   		callback();
	});
	
	CLIRPL.vorpal
		.command('transactions [address]', 'Return historical transactions on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying ledger for transactions for account ${args.address}`).start();
			
			// await CLIRPL.ripple.getTransactions(args.address)
			await CLIRPL.wsconnection.send({ command: 'account_tx',
														account: args.address,
														limit: 20,
														ledger_index_min: -1,
														ledger_index_max: -1,
														binary: false,
														forward: false
													})
         .then((result) => {

				CLIRPL.logger.warn(`${result.transactions.length}`);
				let txs = [];
				_.forEach(result.transactions, (item) => {
					txs.push(item.tx);
				})				

				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(txs)}`) 
						: RippleAccountPretty.transactions(txs);
         })
   		callback();
	});
	
	CLIRPL.vorpal
		.command('submit', 'Submit signed transaction to ledger.')
		.option('--signature [signature]') // Name of unlocked wallet

   	.action(async function(args, callback) {

			await CLIRPL.wsconnection.send({ command: 'submit',
														tx_blob: args.signature
													})
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.signed(result);
			})
         callback();
   });
	
	return new Promise(function(resolve, reject) {
		resolve();
	});
}