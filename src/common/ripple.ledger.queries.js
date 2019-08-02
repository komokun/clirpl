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
   let _data = null;
   await Promise.all(fns).then((results) => { 
   
      results.forEach((res) => {
         if (!res.result) {error_list.push(res.error)}
      });

      if (error_list.length == 0) {
         _data = results[0].data;
      }
   });

   //console.log(_data);
   
   return (error_list.length > 0) ? 
      Promise.resolve({result : 'failure', errors: error_list }) : 
         Promise.resolve({result : 'success', data: _data});
}

export const Query = (queryfxs) => R.converge(omnibus, queryfxs);