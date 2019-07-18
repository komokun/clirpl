const EventEmitter = require('events');

var _ = require('lodash');

import { RippleHelpers } from '../common/ripple.helpers'
import { RippleAccount, RippleTransactions } from '../api/xrpl.ledger.methods'

class Payment extends EventEmitter {

   constructor(connection, input) {

      this.connection = connection;
      this.account = input.data.account;
      this.destination = input.data.destination;
      this.amount = input.data,amount;
      this.type = input.data.type;
   }

   send(){

      if(!this.connection) {

         this.emit('error', { status: `fail`, message: `Ripple ledger connection is NOT valid.`, data: {} });
         return;
      }

      // validate account
      // validate destination
      
      if(type === 'base'){

         if (isNaN(this.amount.value)){

            this.payment = RippleTransactions.payment( this.account
											, this.destination.account
											, this.destination.tag
											, this.amount.value
											, this.sequence);
			} else{
            this.emit('error', { status: `fail`, message: `Payment amount is NOT valid.`, data: {} });
            return;
         }
      } else {
         
         // validate issuer
         this.validate_issuer();
         // validate trustline between issuer and destination
         this.validate_trustline();

         this.payment = RippleTransactions.payment( this.account
											, this.destination.account
											, { currency: this.symbol, issuer: this.issuer, value: this.amount.value }
											, this.sequence);
      }
      
   }

   async validate_account(){

      this.emit('info', { message: `Validating account.`, data: { account: this.account } })

      let is_issuer_valid = await RippleValidators.is_account_valid(CLIRPL, this.account);
      (is_issuer_valid) ? 
         this.emit('result', { status: `succeed`, message: `Account is valid`, data: {} })
         :  this.emit('error', { status: `fail`, message: `Account is NOT valid`, data: {} });
   }

   async validate_issuer(){

      this.emit('info', { message: `Validating issuer account for ${this.amount.issuer}.`, data: { } });

      let is_issuer_valid = await RippleValidators.is_account_valid(CLIRPL, this.amount.issuer);
      (is_issuer_valid) ? 
         this.emit('result', { status: `succeed`, message: `Account is valid`, data: {} })
         :  this.emit('error', { status: `fail`, message: `Account is NOT valid`, data: {} });
   }

   async validate_trustline(){

      this.emit('info', { message: `Validating trustline between ${this.account} and ${this.amount.issuer}.`, data: {} })

      let objects = await RippleAccount.objects(CLIRPL.wsconnection, this.account);
      let found = false;

      _.forEach(objects.account_objects, (object) => {

         if(object.Balance.currency === this.amount.currency){
            (object.HighLimit.issuer || object.LowLimit.issuer) ? found = true : found = false;
            break;
         }
      });

      (found) ? 
         this.emit('result', { status: `succeed`, message: `Trustline is valid`, data: {} })
         :  this.emit('error', { status: `fail`, message: `Trustline does NOT exist.`, data: {} });
   }

   async get_account_currencies(){

      this.emit('info', { message: `Getting currencies for account ${this.account}.`, data: {} })

      let currencies = [];
      await RippleAccount.currencies(CLIRPL.wsconnection, this.account)													
      .then((result) => {
			rcurrencies = result.receive_currencies;
      });
      this.emit('result', { status: `succeed`, message: `${currencies.length} currencies found`, data: currencies });
   }

   async get_sequence_number(){

      this.emit('info', { message: `Retrieving sequence number for ${this.account}.`, data: {} });
      await RippleHelpers.get_sequence_number(this.account).then( (result) => {
         this.sequence = result;
         this.emit('result', { status: `succeed`, message: `Sequence number retrieved.`, data: {sequence: this.sequence} })
		});
   }
}

module.exports = Payment;