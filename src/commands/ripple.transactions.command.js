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

		await CLIRPL.wsconnection.send({ command: 'submit' 
										, tx_blob: blob	
		}).then((result) => {
			
			CLIRPL.logger.info(`${JSON.stringify(result)}`);
			return result; 
		}).error((error) => {
			return error;
		});
	},
}
