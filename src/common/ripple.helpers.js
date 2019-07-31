const RippleAPI = require('ripple-lib').RippleAPI;


const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
 
export const RippleHelpers = {

   get_max_ledger_version: () => {

      return api.getLedger().then(ledger => {  
      
         //console.log("ledger.ledgerVersion ", ledger.ledgerVersion);
         return ledger.ledgerVersion + 4;
      }).catch(err => console.error(err));
   },
    
   get_sequence_number: async (address) => {

      let result = null;
      await api.connect().then(() => {

         return api.getAccountInfo(address).then( (info) => {
            result = info.sequence;
         }).catch(err => console.error('get_sequence_number ', err));
      })
      return result;
   }
}

 