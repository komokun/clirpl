/* eslint-disable no-console */
const R = require('ramda');

const validate_result = (result) => { 
   // TODO: check if result is valid
   return result.account_objects;
}

const transduce_account_objects = (objects) => {
   //return R.map(R.prop('account_objects'), objects);
}

const results_promise = (objects) => {
   //console.log(`OBJECTS : ${JSON.stringify(objects)}`)
   return Promise.resolve({result : 'success', objects: objects });
}

const ResultToAccObjectsList = (result) => { 

   const transformer = R.pipe(
      validate_result,
      //transduce_account_objects,
      results_promise
   )(result)   

   return transformer
}

module.exports = {
   ResultToAccObjectsList
}