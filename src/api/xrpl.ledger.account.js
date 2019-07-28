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

module.exports = {
   IsAccountValid
};