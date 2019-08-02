/* eslint-disable no-console */
const R = require('ramda');

const validate_result = (result) => { 
   // TODO: check if result is valid
   return result.channels;
}

const transduce_account_objects = (objects) => {
   //return R.map(R.prop('account_objects'), objects);
}

const results_promise = (channels) => {
   //console.log(`OBJECTS : ${JSON.stringify(objects)}`)
   return Promise.resolve({result : 'success', channels: channels });
}

const ResultToAccChannelsList = (result) => { 

   const transformer = R.pipe(
      validate_result,
      //transduce_account_objects,
      results_promise
   )(result)   

   return transformer
}

module.exports = {
   ResultToAccChannelsList
}