
import { IsAccountValid } from './xrpl.ledger.account'

const source_account_validator = async ({ connection, emitter, account } = transaction) => { 
    return await IsAccountValid(connection, emitter, account);
}
const issuer_account_validator = async  ({ connection, emitter, issuer } = transaction) => { 
    return await IsAccountValid(connection, emitter, issuer);
}
const destination_account_validator = async ({ connection, emitter, destination } = transaction) => { 
    return await IsAccountValid(connection, emitter, destination);
}

const account_sequence_number = (account) => get_sequence_number(account);

const PaymentValidatorSet = () => { return [ source_account_validator ]; }

module.exports = {
    PaymentValidatorSet
};