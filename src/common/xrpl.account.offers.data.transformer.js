/* eslint-disable no-console */
const R = require('ramda');

const validate_result = (result) => { 
   // TODO: check if result is valid
   return result.offers;
}

const transduce_account_objects = (objects) => {
   //return R.map(R.prop('account_objects'), objects);
}

const results_promise = (offers) => {
   //console.log(`OBJECTS : ${JSON.stringify(objects)}`)
   return Promise.resolve({result : 'success', offers: offers });
}

const ResultToAccOffersList = (result) => { 

   const transformer = R.pipe(
      validate_result,
      //transduce_account_objects,
      results_promise
   )(result)   

   return transformer
}

module.exports = {
   ResultToAccOffersList
}