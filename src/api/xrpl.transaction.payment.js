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

      this.blob = '';
   }

   sign(){

		await axios.post(endpoint, { address: this.address, transaction: this.payment })
		.then((result) => {
			// console.log(`Signed ${JSON.stringify(result.status)}`);
         // console.log(`Signed Data ${JSON.stringify(result.data.data.tx_blob)}`);
         if (result.status === 'success') { this.blob = result.data.data.tx_blob; }

         (result.status === 'success') ? 
         this.emit('sign_success', { status: `succeed`, message: `Successfully signed payment transaction.`, data: result })
         :  this.emit('sign_error', { status: `fail`, message: `Failed to sign transaction.`, data: result });
		});
   }

   submit(){

		await CLIRPL.wsconnection.send({ command: 'submit' , tx_blob: this.blob})
		.then((result) => {
         (result) ? 
         this.emit('submit_success', { status: `succeed`, message: `Payment has been successfully submitted to the ledger`, data: result })
         :  this.emit('submit_error', { status: `fail`, message: `Failed to submit payment to the ledger.`, data: result });
		});
   }

   execute(){

      if(!this.connection) {

         this.emit('error', { status: `fail`, message: `Ripple ledger connection is NOT valid.`, data: {} });
         return;
      }
      // validate account
      this.validate_account(this.account);
      // validate destination
      this.validate_account(this.destination);
      
      if(type === 'base'){

         if (isNaN(this.amount.value)){

            this.payment = RippleTransactions.payment( this.account
											, this.destination.account
											, this.destination.tag
											, this.amount.value
                                 , this.sequence);
                                 
            this.sign();
			} else{
            this.emit('error', { status: `fail`, message: `Payment amount is NOT valid.`, data: {} });
            return;
         }
      } else {
         // validate issuer
         this.validate_account(this.issuer);
         // validate trustline between issuer and destination
         this.validate_trustline();

         this.payment = RippleTransactions.payment( this.account
											, this.destination.account
											, { currency: this.symbol, issuer: this.issuer, value: this.amount.value }
                                 , this.sequence);
                                 
         this.sign();
      }
   }

   async validate_account(address, account_type){

      this.emit('info', { message: `Validating ${account_type} account, ${address}.`, data: {} })

      let is_issuer_valid = await RippleValidators.is_account_valid(CLIRPL, address);
      (is_issuer_valid) ? 
         this.emit('validate_account_success', { status: `succeed`, message: `${account_type} account is valid`, data: {} })
         :  this.emit('validate_account_error', { status: `fail`, message: `${account_type} account is NOT valid`, data: {} });
   }

   async validate_trustline(){

      this.emit('info', { context: 'validate_trustline', message: `Validating trustline between ${this.account} and ${this.amount.issuer}.`, data: {} })

      let objects = await RippleAccount.objects(CLIRPL.wsconnection, this.account);
      let found = false;

      _.forEach(objects.account_objects, (object) => {

         if(object.Balance.currency === this.amount.currency){
            (object.HighLimit.issuer || object.LowLimit.issuer) ? found = true : found = false;
            break;
         }
      });

      (found) ? 
         this.emit('validate_trustline_success', { status: `succeed`, message: `Trustline is valid`, data: {} })
         :  this.emit('validate_trustline_error', { status: `fail`, message: `Trustline does NOT exist.`, data: {} });
   }

   async get_account_currencies(){

      this.emit('info', { message: `Getting currencies for account ${this.account}.`, data: {} })

      let currencies = [];
      await RippleAccount.currencies(CLIRPL.wsconnection, this.account)													
      .then((result) => {
			rcurrencies = result.receive_currencies;
      });
      this.emit('get_account_currencies_success', { status: `succeed`, message: `${currencies.length} currencies found`, data: currencies });
   }

   async get_sequence_number(){

      this.emit('info', { message: `Retrieving sequence number for ${this.account}.`, data: {} });
      await RippleHelpers.get_sequence_number(this.account).then( (result) => {
         this.sequence = result;
         this.emit('get_sequence_number_success', { status: `succeed`, message: `Sequence number retrieved.`, data: {sequence: this.sequence} })
		});
   }
}

module.exports = Payment;