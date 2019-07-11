
export const RippleTransactions = {

	payment: (source, destination, destination_tag, amount) => {

		return {
			      TransactionType: 'Payment',
			      Account: source,
			      Fee: 10,
			      Destination: destination,
			      DestinationTag: destination_tag,
					Amount: amount * 1000000, // Amount in drops, so multiply (6 decimal positions)
			      Sequence: 110
		}
	},

	submit: async (CLIRPL, blob) => {
		CLIRPL.spinner.start(`Submitting transaction to the ledger.`).start();

		await CLIRPL.wsconnection.send({ command: 'submit' 
										, tx_blob: blob	
		}).then((result) => {
			
			CLIRPL.spinner.stop();
			CLIRPL.logger.info(`${JSON.stringify(result)}`) 
		});
									
	},
}
