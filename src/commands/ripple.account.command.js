var _ = require('lodash');

import { RippleAccountPretty } from '../pretty/ripple.account.pretty'
import { RippleAccount } from '../api/xrpl.ledger.methods'


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
			
			await RippleAccount.info(CLIRPL.wsconnection, args.address)													
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.info(result.account_data);
         })
   		callback();
	});

	CLIRPL.vorpal
		.command('account currencies [address]', 'Return currency information on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for currencies on account ${args.address}`);
			
			await RippleAccount.currencies(CLIRPL.wsconnection, args.address)													
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.info(result);
         })
   		callback();
	});

	CLIRPL.vorpal
		.command('account objects [address]', 'Return objects on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for objects on account ${args.address}`).start();
			
			await RippleAccount.objects(CLIRPL.wsconnection, args.address)													
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.info(result.account_objects);
         })
   		callback();
	});

	CLIRPL.vorpal
		.command('account offers [address]', 'Return objects on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying server for objects on account ${args.address}`).start();
			
			await RippleAccount.offers(CLIRPL.wsconnection, args.address)													
         .then((result) => {
				CLIRPL.spinner.stop();
				!(args.options.pretty) ? 
					CLIRPL.logger.info(`${JSON.stringify(result)}`) 
						: RippleAccountPretty.info(result.offers);
         })
   		callback();
	});
	
	CLIRPL.vorpal
		.command('transactions [address]', 'Return historical transactions on a specified account.')
		.option('-p, --pretty')
   	.action(async function(args, callback) {
			CLIRPL.spinner.start(`Querying ledger for transactions for account ${args.address}`).start();
			
			await RippleAccount.transactions(CLIRPL.wsconnection, args.address)	
         .then((result) => {

				//CLIRPL.logger.warn(`${result.transactions}`);
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

