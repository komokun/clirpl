/* eslint-disable no-console */
const R = require('ramda');

const omnibus = async (...fns) => { 

   let error_list = [];

   await Promise.all(fns).then((results) => { 
   
      results.forEach((res) => {
         if (!res.result) {error_list.push(res.error)}
      });
   });
   return (error_list.length > 0) ? Promise.resolve({result : 'failure', errors: error_list }) : Promise.resolve({result : 'success'});
}

export const ConvergedValidators = (validators) => R.converge(omnibus, validators);