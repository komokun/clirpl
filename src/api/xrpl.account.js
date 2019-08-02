const R = require('ramda');
const EventEmitter = require('events');

import { ConvergedValidators as Validators } from '../common/ripple.ledger.validators';
import { Query } from '../common/ripple.ledger.queries'
import { AccountValidatorSet, AccountTransactionsSet, AccountOffersSet,
            AccountCurrenciesSet, AccountObjectsSet, AccountChannelsSet } from './xrpl.account.actions'

import { ResultToAccTxList } from '../common/xrpl.account.tx.data.transformer'
import { ResultToAccCurrenciesList } from '../common/xrpl.account.currency.data.transformer'
import { ResultToAccObjectsList } from '../common/xrpl.account.objects.data.transformer'
import { ResultToAccOffersList } from '../common/xrpl.account.offers.data.transformer'
import { ResultToAccChannelsList } from '../common/xrpl.account.channels.data.transformer'


import { Promisify } from '../utilities/common'

class LedgerAccount extends EventEmitter {

   constructor(set) {

      super();

      this._set = set;
      // Connections
      this._ws       = set.ws;
      this._vault    = set.vault;
   }


   validate = () => {

      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account }
      
      const validators = Validators(AccountValidatorSet());
      return Promise.resolve(validators(input));
   }

   transactions = () => {
      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account }
      
      return  R.pipeP(
                        Query(AccountTransactionsSet()),
                        Promisify,
                        R.prop('data'),
                        ResultToAccTxList
                     )(input);
   }
   
   currencies = () => {
      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account }

      return  R.pipeP(
                        Query(AccountCurrenciesSet()),
                        Promisify,
                        R.prop('data'),
                        ResultToAccCurrenciesList
                     )(input);
   }

   objects = () => {
      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account }

      return  R.pipeP(
                        Query(AccountObjectsSet()),
                        Promisify,
                        R.prop('data'),
                        ResultToAccObjectsList
                     )(input);
   }

   offers = () => {
      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account }

      return  R.pipeP(
                        Query(AccountOffersSet()),
                        Promisify,
                        R.prop('data'),
                        ResultToAccOffersList
                     )(input);
   }

   channels = () => {
      if(!this._set.account) { return Promise.resolve({ result: false, error: `Account string is empty.` }); }

      const input = { connection: this._ws, emitter: this, account: this._set.account, counterparty: this._set.counterparty }

      return  R.pipeP(
                        Query(AccountChannelsSet()),
                        Promisify,
                        R.prop('data'),
                        ResultToAccChannelsList
                     )(input);
   }
}

module.exports = LedgerAccount;