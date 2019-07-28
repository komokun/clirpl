import { ConvergedValidators } from '../common/ripple.ledger.validators';
import { PaymentValidatorSet } from './xrpl.transaction.payment'
const R = require('ramda');
const EventEmitter = require('events');

const RippledWsClient       = require('rippled-ws-client');


class LedgerTransaction extends EventEmitter {

   constructor(ledgerset) {

      super();

      // console.log(`Ledgerset is ${JSON.stringify(ledgerset.message)}`);

      this._message        = ledgerset.message;
      this._type           = this._message.trans_type;
      this._message        = this._message;
      this._validators     = this.get_validators();

      // Connections
      this._ws       = ledgerset.ws;
      this._api      = ledgerset.api;
      this._vault    = ledgerset.vault;
   }

   async validate () {

      let input = { connection: this._ws, emitter: this, 
                     account: this._message.account, destination: this._message.destination }
      let converged = ConvergedValidators(this._validators);
      return converged(input)
   }

   async sign() {

      let input = { vault: this._vault, emitter: this, 
                     account: this._message.account, message: this._message }
   }

   submit() {}

   get_validators() {
   
      if (this._type === 'payment') {
         return PaymentValidatorSet();
      }
   }
}

module.exports = LedgerTransaction;