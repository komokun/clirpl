import { RippleTransaction } from '../api/xrpl.ledger.methods'

const SubmitTransaction = async (connection, emitter, blob) => {

   let result = await RippleTransaction.submit(connection, blob);

   console.log(`Submit Result is ${JSON.stringify(result)}`)

   if(result.account_data) {
      emitter.emit('submit_transaction_success', { status: `succeed`, message: `Transaction has been submitted`, data: {} });
      return Promise.resolve({ result: true });
   } else if (result.status === 'error') {
      emitter.emit('submit_transaction_error', { status: `fail`, message: `Failed to submit transaction`, data: {} });
      return Promise.resolve({ result: false, error: `Error while submitting transaction, ${result.error_message}` });
   }
}

module.exports = {
   SubmitTransaction
}