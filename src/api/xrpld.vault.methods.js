const axios = require('axios');

export const Wallet = {

   ping: async (endpoint) => {
      return await axios.get(endpoint);
   },
   
   sign: async (endpoint, transaction) => {

      const body = {
         address: transaction.Account,
         transaction: transaction
      }
	   return await axios.post(endpoint, body);
   },
}