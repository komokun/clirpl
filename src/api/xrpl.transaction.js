import { ConvergedValidators as Validators } from '../common/ripple.ledger.validators';
import { PaymentValidatorSet, PaymentSignerSet, PaymentSubmitterSet } from './xrpl.transaction.payment'
import { Signer } from '../common/ripple.ledger.signer';
import { Submitter } from '../common/ripple.ledger.submitter';
const R = require('ramda');
const EventEmitter = require('events');

class LedgerTransaction extends EventEmitter {

   constructor(ledgerset) {

      super();

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

   validator = () => {

      const input = { connection: this._ws, emitter: this, 
                     account: this._message.account, destination: this._message.destination }
      const validators = Validators(this._validators);
      return Promise.resolve(validators(input));
   }

   signer = (validated) => {

      const input = { vault: this._vault, emitter: this, wallet: 'default',
                     account: this._message.account, message: this._message }
      const signer = Signer(this._signer);
      return Promise.resolve(signer(input));
   }

   blob        = R.prop('blob');
   promisify   = x  => Promise.resolve(x); // Take a value and return a promise of the same.

   submitter = (blob) => {

      const input = { connection: this._ws, vault: this._vault, emitter: this, 
                     account: this._message.account, message: this._message, blob: blob }
      const submitter = Submitter(this._submitter);
      return Promise.resolve(submitter(input));      
   }
   
   execute = () => {

      const executer = R.pipeP(
         this.validator,
         this.signer,
         R.compose(this.promisify, this.blob),
         this.submitter,
         console.log
      )

      return executer();
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