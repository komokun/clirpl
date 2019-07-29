const axios = require('axios');

export const Wallet = {

   ping: async (endpoint) => {
      return await axios.get(endpoint);
   },
   
   sign: async (endpoint, message) => {
	return await axios.post(endpoint, { address: message.account, transaction: message });
   },
}