export const RippleTransactionTemplate = {

	payment: (address, destination, destination_tag, amount, sequence) => {

		return {
			      TransactionType: 'Payment',
			      Account: address,
			      Fee: 10,
			      Destination: destination,
			      // DestinationTag: destination_tag,
					Amount: amount * 1000000, // Amount in drops, so multiply (6 decimal positions)
			      Sequence: sequence
		}
	},

	amount: (amount) => {


		
	},
	
	trustset: (address, limit, sequence) => {

		return {
					TransactionType: 'TrustSet',
					Account: address,
					Fee: '1200',
					Flags: 262144,
					//LastLedgerSequence: 0,//getSequenceNumber(address),
					LimitAmount: limit,
					Sequence: sequence
		}
	},

	limit: (issuer, symbol, value) => {
		
		return {
			      currency: symbol,
			      issuer: issuer,
			      value: value				   												 
		}
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