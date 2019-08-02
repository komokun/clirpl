/* eslint-disable no-console */
const R = require('ramda');
/**
 * @param {*} result 
 */

const validate_and_return_tx_object_from_result = (result) => { 
   // TODO: check if input is valid
   return result.transactions;
}

const txs_from_object_transducer = (txs) => { 
   return R.into([])(R.map(R.prop('tx')), txs)
}

const sort_and_label_txs_by_type = (txs) => {
   
   return R.mergeAll([
                        { trustsets: R.filter(R.propEq('TransactionType', 'TrustSet'), txs) },
                        { payments: R.filter(R.propEq('TransactionType', 'Payment'), txs) },
                        { count: txs.length }
                     ]);
}

const return_transactions_promise = (txs) => {
   return Promise.resolve({result : 'success', transactions: txs });
}

const ResultToAccTxList = (result) => { 

   const transformer = R.pipe(
      validate_and_return_tx_object_from_result,
      txs_from_object_transducer,
      sort_and_label_txs_by_type,
      return_transactions_promise
   )(result)   

   return transformer
}

module.exports = {
   ResultToAccTxList
}
