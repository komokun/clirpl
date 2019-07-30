/* eslint-disable no-console */
const R = require('ramda');

/**
 * 
 * @param  {...any} fns 
 * 
 * Take a list of functions (fns) . 
 * The last MUST be a signer that produces a transaction hash
 * At 'success', a transaction hash is returned.
 */

const omnibus = async (...fns) => { 

   let error_list = [];
   let _hash = '';
   await Promise.all(fns).then((results) => { 
   
      results.forEach((res) => {
         if (!res.result) {error_list.push(res.error)}
      });

      if (error_list.length == 0) {
         _hash = results[0].hash;
      }
   });
   
   return (error_list.length > 0) ? 
      Promise.resolve({result : 'failure', errors: error_list }) : 
         Promise.resolve({result : 'success', hash: _hash });
}

export const Submitter = (submiterfxs) => R.converge(omnibus, submiterfxs);