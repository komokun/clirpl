import { RippleAccount } from '../api/xrpl.ledger.methods'

export const RippleValidators = {

   is_account_valid: async (CLIRPL, address) => {
      CLIRPL.spinner.start(`Validating submitted issuer account...`);

      let result = await RippleAccount.info(CLIRPL.wsconnection, address);													
      if(result.account_data) {
         CLIRPL.spinner.succeed(`Account is valid...`);
         CLIRPL.logger.warn(`${JSON.stringify(result)}`);
         return true;
      } else if (result.status === 'error') {
         CLIRPL.spinner.fail(`Account is NOT valid. Reason : ${result.error_message}`);
         return false;
      }
   }
}