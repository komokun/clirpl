import { IsAccountValid } from './xrpl.ledger.account'

const account_validator = async ({ connection, emitter, account } = set) => { 
   return await IsAccountValid(connection, emitter, account);
}

const AccountValidatorSet = () => { return [ account_validator ]; }

module.exports = {
   AccountValidatorSet
}
