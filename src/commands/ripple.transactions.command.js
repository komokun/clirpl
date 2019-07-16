var _ = require('lodash');

import { RippleTransactionPretty } from '../pretty/ripple.transactions.pretty';
import { RippleHelpers } from '../common/ripple.helpers'
import { WalletEndpoints } from '../common/clirpl.endpoints'


module.exports = function(CLIRPL) {
	
	CLIRPL.vorpal
      .command('payment', 'Send a ledger payment.')
      .option('-n --name [name]') // Name of unlocked wallet
		.option('-a --address [address]')
		.option('-d --destination [destination]')
		.option('-t --tag [tag]')
		.option('-v --value [value]')
   	.action(async function(args, callback) {

			CLIRPL.spinner.start(`Attempting to send a payment at ${CLIRPL.ledger_endpoint}`).start();
			
			console.log(args.options);
			let trans = RippleTransactions.payment( args.options.address
											, args.options.destination
											, ''
											, args.options.value);

			const endpoint = WalletEndpoints.sign_transaction(args.options.name);

			const signed = await 
				axios.post(endpoint, { address: args.options.source, transaction: trans });

			RippleTransactions.submit(signed.data.data.tx_blob.toString());

   		callback();
   });
	
	CLIRPL.vorpal
      .command('trustset', 'Create a trustline between two accounts.')
      .option('-n --name [name]') // Name of unlocked wallet
		.option('-a --address [address]')
		.option('-d --issuer [issuer]')
		.option('-s --symbol [symbol]')
		.option('-l --limit_amount [limit_amount]')
   	.action(async function(args, callback) {

			CLIRPL.spinner.start(`Attempting to send a payment at ${CLIRPL.ledger_endpoint}`).start();
			
			let limit = RippleTransactions.limit( args.options.issuer
															, args.options.symbol
															, args.options.limit_amount);
			console.log(args.options);
			let trustset = RippleTransactions.trustset( args.options.address
																	, limit);

			const endpoint = WalletEndpoints.sign_transaction(args.options.name);

			const signed = await axios.post(endpoint, trustset);

			console.log(signed.data.data.tx_blob.toString());

			// RippleTransactions.submit(signed.data.data.tx_blob.toString());

   		callback();
   });

	return new Promise(function(resolve, reject) {
		resolve();
	});
}

export const RippleTransactions = {

	payment: (address, destination, destination_tag, amount) => {

		return {
			      TransactionType: 'Payment',
			      Account: address,
			      Fee: 10,
			      Destination: destination,
			      // DestinationTag: destination_tag,
					Amount: amount * 1000000, // Amount in drops, so multiply (6 decimal positions)
			      Sequence: RippleHelpers.get_sequence_number(address)
		}
	},
	
	trustset: (address, limit) => {

		return {
					TransactionType: "TrustSet",
					Account: address,
					Fee: "1200",
					Flags: 262144,
					//LastLedgerSequence: 0,//getSequenceNumber(address),
					LimitAmount: limit,
					Sequence: RippleHelpers.get_sequence_number(address)
		}
	},

	limit: (issuer, symbol, value) => {
		
		return {
			      currency: symbol,
			      issuer: issuer,
			      value: value				   												 
		}
	},

	submit: async (blob) => {

		return await CLIRPL.wsconnection.send({ command: 'submit' , tx_blob: blob});
	},
}
