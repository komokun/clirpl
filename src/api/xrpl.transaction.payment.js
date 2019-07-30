
import { IsAccountValid } from './xrpl.ledger.account'
import { SubmitTransaction } from './xrpl.ledger.transaction'
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
 
    

    const endpoint = WalletEndpoints.sign_transaction(wallet);

    const transaction = {
            TransactionType: 'Payment',
            Account: message.account,
            Destination: message.destination,
            Amount: 1.05 * 1000000, // Amount in drops, so multiply (6 decimal positions)
        }


    return await Wallet.sign(endpoint, transaction)
            .then((response) => {
                if(response.data.result === 'success') {
                    emitter.emit('transaction_signer_success', { status: `succeed`, message: `Transaction signed successfully.`});
                    return Promise.resolve({ result: true, blob: response.data.data.tx_blob });
                } else {
                    emitter.emit('transaction_signer_error', { status: `fail`, message: `Failed to sign transaction`});
                    return Promise.resolve({ result: false, error: `Error signing transaction, ${result.message}` });
                }
            });
    
}


const transaction_submitter = async ({ connection, emitter, message } = set) => {
    return await SubmitTransaction(connection, emitter, message);
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