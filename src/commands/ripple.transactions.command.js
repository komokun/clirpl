const axios = require('axios');
var _ = require('lodash');

import { RippleTransactionPretty } from '../pretty/ripple.transactions.pretty';
import { RippleHelpers } from '../common/ripple.helpers'
import { WalletEndpoints } from '../common/clirpl.endpoints'
import { RippleAccount, RippleTransactions } from '../api/xrpl.ledger.methods'


module.exports = function(CLIRPL) {
	
	CLIRPL.vorpal
      .command('payment', 'Send a ledger payment.')
      .option('-n --name [name]') // Name of unlocked wallet
		.option('-a --address [address]')
		.option('-d --destination [destination]')
		.option('-t --tag [tag]')
		.option('-p --icp') // issued currency payment
		.option('-v --value [value]')
		.option('-c --currency [currency]')
		.option('-i --issuer [issue]')
   	.action(async function(args, callback) {

			//CLIRPL.spinner.start(`Attempting to send a payment at ${CLIRPL.ledger_endpoint}`).start();
			CLIRPL.logger.info('Sending a ledger payment.');
			// 1. check if issued currency flag is on.
			// 1a.) check if issuer is valid
			if(args.options.icp){
				CLIRPL.logger.info('Starting an issued currency payment.');
				//console.log('This is an issued currency payment...')
				CLIRPL.spinner.start(`Validating submitted issuer account...`);

				CLIRPL.spinner.succeed(`Issuer account is valid...`);
				
				CLIRPL.spinner.start(`Checking if submitted account issues requested currency...`);

				CLIRPL.spinner.succeed(`Submitted currency is issued by submitted account...`);
			}

			

			// 2. if on validate currency, issuer and value.

			// 3. if off, validate just value
/*
			let seq = null;
		   await RippleHelpers.get_sequence_number(args.options.address).then( (result) => {
				seq = result;
			})

			let amount = 0;
			if (isNaN(args.options.value)){

				amount = RippleTransactions.amount(args.options.value);
			}

			

			let payment = RippleTransactions.payment( args.options.address
											, args.options.destination
											, ''
											, amount
											, seq);

			const endpoint = WalletEndpoints.sign_transaction(args.options.name);

			//console.log(JSON.stringify(payment));
			
			let blob = '';
			await axios.post(endpoint, { address: args.options.address, transaction: payment })
					.then((result) => {
						console.log(`Signed ${JSON.stringify(result.status)}`);
						console.log(`Signed Data ${JSON.stringify(result.data.data.tx_blob)}`);
						blob = result.data.data.tx_blob;
					});

			await CLIRPL.wsconnection.send({ command: 'submit' , tx_blob: blob})
					.then((res) => {
						CLIRPL.spinner.stop();
						console.log(`Submited Payment ${JSON.stringify(res)}`);
					});
*/
   		callback();
   });
	
	CLIRPL.vorpal
      .command('trustset', 'Create a trustline between two accounts.')
      .option('-n --name [name]') // Name of unlocked wallet
		.option('-a --address [address]')
		.option('-i --issuer [issuer]')
		.option('-c --currency [currency]')
		.option('-v --value [value]')
   	.action(async function(args, callback) {

			CLIRPL.spinner.start(`Attempting to send a payment at ${CLIRPL.ledger_endpoint}`).start();
			
			let limit = RippleTransactions.limit( args.options.issuer
															, args.options.currency
															, args.options.value);
			
			let address = args.options.address;

			let seq = null;
		   await RippleHelpers.get_sequence_number(address).then( (result) => {
				seq = result;
			})
			
			let trustset = await RippleTransactions.trustset( args.options.address
																	, limit, seq);
			// console.log(JSON.stringify(trustset));

			const endpoint = WalletEndpoints.sign_transaction(args.options.name);
			// console.log(endpoint);

			let blob = '';
			await axios.post(endpoint, { address: address, transaction: trustset })
					.then((result) => {
						console.log(`Signed ${JSON.stringify(result.status)}`);
						console.log(`Signed Data ${JSON.stringify(result.data.data.tx_blob)}`);
						blob = result.data.data.tx_blob;
					});

			await CLIRPL.wsconnection.send({ command: 'submit' , tx_blob: blob})
					.then((res) => {
						CLIRPL.spinner.stop();
						console.log(`Submited ${JSON.stringify(res)}`);
					});

   		callback();
   });

	return new Promise(function(resolve, reject) {
		resolve();
	});
}


