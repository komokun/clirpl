import { RippleAccount } from '../api/xrpl.ledger.methods'

const IsAccountValid = async (connection, emitter, address) => {

   let result = await RippleAccount.info(connection, address);

   if(result.account_data) {
      emitter.emit('validate_account_success', { status: `succeed`, message: `${address} account is valid`, data: {} });
      return Promise.resolve({ result: true });
   } else if (result.status === 'error') {
      emitter.emit('validate_account_error', { status: `fail`, message: `${address} account is NOT valid`, data: {} });
      return Promise.resolve({ result: false, error: `Error while validating account ${address}, ${result.error_message}` });
   }
}

const AccountTransactions = async (connection, emitter, address) => {

   let result = await RippleAccount.transactions(connection, address);

   //console.log(`AccountTransactions Result ${JSON.stringify(result)}`);

   if(result) {
      emitter.emit('account_transaction_query_success', { status: `succeed`, message: `Successfully queried transactions for ${address}` });
      return Promise.resolve({ result: true, data: result });
   } else if (result.status === 'error') {
      emitter.emit('account_transaction_query_error', { status: `fail`, message: `Failed to query ${address} for transactions` });
      return Promise.resolve({ result: false, error: `Error while querying transactions for ${address}, ${result.error_message}` });
   }
}

const AccountCurrencies = async (connection, emitter, address) => {

   let result = await RippleAccount.currencies(connection, address);

   if(result) {
      emitter.emit('account_currencies_query_success', { status: `succeed`, message: `Successfully queried currencies for ${address}` });
      return Promise.resolve({ result: true, data: result });
   } else if (result.status === 'error') {
      emitter.emit('account_currencies_query_error', { status: `fail`, message: `Failed to query ${address} for currencies` });
      return Promise.resolve({ result: false, error: `Error while querying currencies for ${address}, ${result.error_message}` });
   }
}

const AccountObjects = async (connection, emitter, address) => {

   let result = await RippleAccount.objects(connection, address);

   if(result) {
      emitter.emit('account_objects_query_success', { status: `succeed`, message: `Successfully queried objects for ${address}` });
      return Promise.resolve({ result: true, data: result });
   } else if (result.status === 'error') {
      emitter.emit('account_objects_query_error', { status: `fail`, message: `Failed to query ${address} for objects` });
      return Promise.resolve({ result: false, error: `Error while querying objects for ${address}, ${result.error_message}` });
   }
}

const AccountOffers = async (connection, emitter, address) => {

   let result = await RippleAccount.offers(connection, address);

   if(result) {
      emitter.emit('account_offers_query_success', { status: `succeed`, message: `Successfully queried offers for ${address}` });
      return Promise.resolve({ result: true, data: result });
   } else if (result.status === 'error') {
      emitter.emit('account_offers_query_error', { status: `fail`, message: `Failed to query ${address} for offers` });
      return Promise.resolve({ result: false, error: `Error while querying objects for ${address}, ${result.error_message}` });
   }
}

const AccountChannels = async (connection, emitter, address, counterparty) => {

   let result = await RippleAccount.channels(connection, address, counterparty);

   if(result) {
      emitter.emit('account_channels_query_success', { status: `succeed`, message: `Successfully queried channels for ${address}` });
      return Promise.resolve({ result: true, data: result });
   } else if (result.status === 'error') {
      emitter.emit('account_channels_query_error', { status: `fail`, message: `Failed to query ${address} for channels` });
      return Promise.resolve({ result: false, error: `Error while querying objects for ${address}, ${result.error_message}` });
   }
}

module.exports = {
   IsAccountValid,
   AccountTransactions,
   AccountCurrencies,
   AccountObjects,
   AccountOffers, 
   AccountChannels
};