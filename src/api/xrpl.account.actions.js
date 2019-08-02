import { IsAccountValid, AccountTransactions, AccountOffers, 
            AccountObjects, AccountCurrencies, AccountChannels } from './xrpl.ledger.account'

const account_validator = async ({ connection, emitter, account } = set) => { 
   return await IsAccountValid(connection, emitter, account);
}

const account_transactions = async ({ connection, emitter, account } = set) => { 
   return await AccountTransactions(connection, emitter, account);
}

const account_objects = async ({ connection, emitter, account } = set) => { 
   return await AccountObjects(connection, emitter, account);
}

const account_currencies = async ({ connection, emitter, account } = set) => { 
   return await AccountCurrencies(connection, emitter, account);
}

const account_offers = async ({ connection, emitter, account } = set) => { 
   return await AccountOffers(connection, emitter, account);
}

const account_channels = async ({ connection, emitter, account, counterparty } = set) => { 
   return await AccountChannels(connection, emitter, account, counterparty);
}


const AccountValidatorSet = () => { return [ account_validator ]; }

const AccountTransactionsSet = () => { return [ account_transactions ]; }

const AccountCurrenciesSet = () => { return [ account_currencies ]; }

const AccountObjectsSet = () => { return [ account_objects ]; }

const AccountOffersSet = () => { return [ account_offers ]; }

const AccountChannelsSet = () => { return [ account_channels ]; }

module.exports = {
   AccountValidatorSet,
   AccountTransactionsSet,
   AccountCurrenciesSet,
   AccountObjectsSet,
   AccountOffersSet,
   AccountChannelsSet
}
