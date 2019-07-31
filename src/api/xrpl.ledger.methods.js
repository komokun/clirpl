import { RippleHelpers } from '../common/ripple.helpers'

let sequence = null;

export const RippleTransactionTemplate = {

	payment: async (message) => {

		let { account, destination, tag, amount } = message
		
		await RippleHelpers.get_sequence_number(account).then( (result) => {
			sequence = result;
	   });

		
		
		return {
			      TransactionType: 'Payment',
			      Account: account,
			      Fee: 10,
			      Destination: destination,
			      DestinationTag: tag,
					Amount: amount * 1000000, // Amount in drops, so multiply (6 decimal positions)
			      Sequence: sequence
		}
	},

	amount: (amount) => {
		
	},
	
	trustset: async (message) => {

		console.log(message);
		let { account, issuer, currency, amount } = message;
		
		await RippleHelpers.get_sequence_number(account).then( (result) => {
			sequence = result;
		});
		
		return {
					TransactionType: 'TrustSet',
					Account: account,
					Fee: 10,
					LimitAmount: { issuer: issuer, currency: currency, value: amount },
					Sequence: sequence
		}
	},

	limit: (issuer, currency, value) => {
		
		return {
			      currency: currency,
			      issuer: issuer,
			      value: value				   												 
		}
	},
}

export const RippleTransaction = {

	submit: async (connection, blob) => {

		return await connection.send({ id: 2, command: 'submit',
														tx_blob: blob
													});
	},	
}

export const RippleAccount = {

	info: async (connection, address) => {

		return await connection.send({ id: 2, command: 'account_info',
														account: address,
														strict: true,
														ledger_index: "current",
														queue: true
													});
	},

	transactions: async (connection, address) => {

		return await connection.send({ id: 2, command: 'account_tx',
														account: address,
														limit: 20,
														ledger_index_min: -1,
														ledger_index_max: -1,
														binary: false,
														forward: false
													});
	},

	currencies: async (connection, address) => {

		return await connection.send({ id: 2, command: 'account_currencies',
														account: address,
														strict: true,
														ledger_index: "validated",
													});
	},

	offers: async (connection, address) => {

		return await connection.send({ id: 1, command: 'account_offers',
														account: address,
													});
	},

	objects: async (connection, address) => {

		return await connection.send({ id: 1, command: 'account_objects',
														account: address,
														ledger_index: "validated",
														type: 'state',
														limit: 10
													});
	},
}