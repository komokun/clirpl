const RippleAPI = require('ripple-lib').RippleAPI;


const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
 
export const RippleHelpers = {

   get_max_ledger_version: () => {

      return api.getLedger().then(ledger => {  
      
         console.log("ledger.ledgerVersion ", ledger.ledgerVersion);
         return ledger.ledgerVersion + 4;
      }).catch(err => console.error(err));
   },
    
   get_sequence_number: (address) => {
    
      return api.getAccountInfo(address).then(info => {
    
         console.log("info.sequence ", info.sequence);
         return info.sequence;
      }).catch(err => console.error(err));
   }
}

 