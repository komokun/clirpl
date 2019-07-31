import { RippleTransaction } from '../api/xrpl.ledger.methods'

const SubmitTransaction = async (connection, emitter, blob) => {

   let result = await RippleTransaction.submit(connection, blob);

   //console.log(`Submit Result is ${JSON.stringify(result)}`)

   if(result.engine_result === 'tesSUCCESS') {
      emitter.emit('submit_transaction_success', { status: `succeed`, message: `Transaction has been submitted`, data: {} });
      return Promise.resolve({ result: true, hash: result.tx_json.hash });
   } else if(result.engine_result === 'tecPATH_DRY') {
      emitter.emit('submit_transaction_fail', { status: `fail`, message: `Transaction was submitted, but the ledger rejected the transaction. Probably, the trustline has been used up.`, data: {} });
      return Promise.resolve({ result: false, error: `Ledger message: ${result.engine_result_message}` });
   } else if(result.engine_result === 'tecPATH_PARTIAL') {
      emitter.emit('submit_transaction_fail', { status: `fail`, message: `Transaction was submitted, but the ledger could only partially apply the transaction. Probably, trust applied greater than trust available`, data: {} });
      return Promise.resolve({ result: false, error: `Ledger message: ${result.engine_result_message}` });
   } else if (result.status === 'error') {
      emitter.emit('submit_transaction_error', { status: `error`, message: `Failed to submit transaction`, data: {} });
      return Promise.resolve({ result: false, error: `Error while submitting transaction. ${result.error_message}` });
   } else {
      emitter.emit('submit_transaction_error', { status: `error`, message: `Transaction was submitted but did not return a success flag.`, data: {} });
      return Promise.resolve({ result: false, error: `No success flag returned. ${result.engine_result_message}` });
   }
}

module.exports = {
   SubmitTransaction
}