
import { IsAccountValid } from './xrpl.ledger.account'
import { Wallet } from './xrpld.vault.methods'
import { WalletEndpoints } from '../common/vault.endpoints'

const source_account_validator = async ({ connection, emitter, account } = set) => { 
    return await IsAccountValid(connection, emitter, account);
}
const issuer_account_validator = async ({ connection, emitter, issuer } = set) => { 
    return await IsAccountValid(connection, emitter, issuer);
}
const destination_account_validator = async ({ connection, emitter, destination } = set) => { 
    return await IsAccountValid(connection, emitter, destination);
}

const transaction_signer = async ({ wallet, emitter, message } = set) => {
 
    const endpoint = WalletEndpoints.sign(wallet);

    const signed = await Wallet.sign(endpoint, message);

    console.log(`Signed is ${signed}`);

    if(signed.result) {
      emitter.emit('transaction_signer_success', { status: `succeed`, message: `Transaction signed successfully.`});
      return Promise.resolve({ result: true, data: { blob: signed.body.data.blob } });
   } else {
      emitter.emit('transaction_signer_error', { status: `fail`, message: `Failed to sign transaction`});
      return Promise.resolve({ result: false, error: `Error signing transaction, ${signed.body}` });
   }
}

const account_sequence_number = (account) => get_sequence_number(account);

const PaymentValidatorSet = () => { return [ source_account_validator, destination_account_validator ]; }

const PaymentSignerSet = () => { return [ transaction_signer ]; }

const PaymentSubmitterSet = () => { return [ transaction_submitter ]; }

module.exports = {
    PaymentValidatorSet,
    PaymentSignerSet,
    PaymentSubmitterSet
};