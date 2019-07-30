/* eslint-disable no-console */
const R = require('ramda');

/**
 * 
 * @param  {...any} fns 
 * 
 * Take a list of functions (fns) . 
 * The last MUST be a signer that produces a blob
 * At 'success', a signed blob is returned.
 */

const omnibus = async (...fns) => { 

   let error_list = [];
   let _blob = '';
   await Promise.all(fns).then((results) => { 
   
      results.forEach((res) => {
         if (!res.result) {error_list.push(res.error)}
      });

      if (error_list.length == 0) {
         _blob = results[0].blob;
      }
   });
   
   return (error_list.length > 0) ? 
      Promise.resolve({result : 'failure', errors: error_list }) : 
         Promise.resolve({result : 'success', blob: _blob});
}

export const Signer = (signerfxs) => R.converge(omnibus, signerfxs);