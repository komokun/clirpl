const axios = require('axios');
var _ = require('lodash');
const R = require('ramda');

import { RippleTransactionPretty } from '../pretty/ripple.transactions.pretty';
import { RippleHelpers } from '../common/ripple.helpers'
import { WalletEndpoints } from '../common/clirpl.endpoints'
import { RippleAccount, RippleTransactionTemplate } from '../api/xrpl.ledger.methods'
import { RippleValidators } from '../common/ripple.ledger.validators'

import { LedgerTransaction } from '../api/xrpl.transaction'
import { PaymentValidatorSet } from '../api/xrpl.transaction.payment'


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
		.option('-i --issuer [issuer]')
   	.action(async function(args, callback) {

			//CLIRPL.spinner.start(`Attempting to send a payment at ${CLIRPL.ledger_endpoint}`).start();
			CLIRPL.logger.info('Sending a ledger payment.');
			// 1. check if issued currency flag is on.
			// 1a.) check if issuer is valid

			let type = 'base'
			(!args.options.icp) ? type = false : type = true;

			let input = { 
								content: {
							 	  	  account: args.options.address
	            	         , destination: args.options.destination
									, amount: {
												currency: args.options.destination || ''
											,	issuer: args.options.issuer || ''
											,	value: args.options.value || 0
										}
								}	
								, issued: type || false	// false denoted native XRP. true denotes issued currency
							}


			let params  = { message: input, trans_type: 'payment', object: null, 
									vault: CLIRPL.connection, xrpl: CLIRPL.wsconnection, 
										validators: PaymentValidatorSet, errors: [] };

			let transaction = new LedgerTransaction(params);
			
			transaction.validate();
			
			/*
			const transaction = R.pipeP(
				XRPLTransaction.validate,
			   XRPLTransaction.sign,
			   XRPLTransaction.submit
			)
			
			transaction(transactionset)
				.then(() => {})
		
			*/


			/*
			if(args.options.icp){
				CLIRPL.logger.info('Starting an issued currency payment.');
				// Check if account format is valid
				let is_issuer_valid = await RippleValidators.is_account_valid(CLIRPL, args.options.issuer);
				if(!is_issuer_valid) { callback(); return; }
				
				// Get account currency
				let rcurrencies = [];
				await RippleAccount.currencies(CLIRPL.wsconnection, args.options.address)													
	         .then((result) => {
					rcurrencies = result.receive_currencies;
	         });
			
				CLIRPL.logger.warn(`${JSON.stringify(rcurrencies)}`);
				
				CLIRPL.spinner.start(`Checking if submitted account issues requested currency...`);

				CLIRPL.spinner.succeed(`Submitted currency is issued by submitted account...`);
			}

*/			

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
			
			let limit = RippleTransactionTemplate.limit( args.options.issuer
															, args.options.currency
															, args.options.value);
			
			let address = args.options.address;

			let seq = null;
		   await RippleHelpers.get_sequence_number(address).then( (result) => {
				seq = result;
			})
			
			let trustset = await RippleTransactionTemplate.trustset( args.options.address
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


