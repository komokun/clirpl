/* eslint-disable no-console */
const R = require('ramda');

const validate_result = (result) => { 
   // TODO: check if result is valid
   return result;
}

const transduce_currencies = (currencies) => {
   return R.mergeAll([
                        { send: R.map(R.prop('send_currencies'), currencies) },
                        { receive:  R.map(R.prop('receive_currencies'), currencies) },
                     ]);
}

const results_promise = (currencies) => {
   return Promise.resolve({result : 'success', currencies: currencies });
}

const ResultToAccCurrenciesList = (result) => { 

   const transformer = R.pipe(
      validate_result,
      transduce_currencies,
      results_promise
   )(result)   

   return transformer
}

module.exports = {
   ResultToAccCurrenciesList
}