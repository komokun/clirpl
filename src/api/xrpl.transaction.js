import { ConvergedValidators as Validators } from '../common/ripple.ledger.validators';
import { PaymentValidatorSet, PaymentSignerSet, PaymentSubmitterSet } from './xrpl.transaction.payment'
import { Signer } from '../common/ripple.ledger.signer';
import { Submitter } from '../common/ripple.ledger.submitter';
const R = require('ramda');
const EventEmitter = require('events');

class LedgerTransaction extends EventEmitter {

   constructor(ledgerset) {

      super();

      // console.log(`Ledgerset is ${JSON.stringify(ledgerset.message)}`);

      this._message        = ledgerset.message;
      this._type           = this._message.trans_type;
      this._message        = this._message;
      this._validators     = this.get_validators();
      this._signer         = this.get_signer();
      this._submitter      = this.get_submitter();      

      // Connections
      this._ws       = ledgerset.ws;
      this._api      = ledgerset.api;
      this._vault    = ledgerset.vault;
   }

   async validate () {

      let input = { connection: this._ws, emitter: this, 
                     account: this._message.account, destination: this._message.destination }
      let validators = Validators(this._validators);
      return validators(input)
   }

   async sign() {

      let input = { vault: this._vault, emitter: this, 
                     account: this._message.account, message: this._message }
      let signer = Signer(this._signer);
      return signer(input);
   }

   async submit() {

      let input = { connection: this._ws, vault: this._vault, emitter: this, 
                     account: this._message.account, message: this._message }
      let submitter = Submitter(this._submitter);
      return submitter(input);      
   }

   get_validators() {
   
      if (this._type === 'payment') {
         return PaymentValidatorSet();
      }
   }

   get_signer() { 

      if (this._type === 'payment') {
         return PaymentSignerSet();
      }
   }

   get_submitter() { 

      if (this._type === 'payment') {
         return PaymentSubmitterSet();
      }
   }
}

module.exports = LedgerTransaction;