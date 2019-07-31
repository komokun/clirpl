
import { IsAccountValid } from './xrpl.ledger.account'
import { SubmitTransaction } from './xrpl.ledger.transaction'
import { Wallet } from './xrpld.vault.methods'
import { WalletEndpoints } from '../common/vault.endpoints'
import { RippleTransactionTemplate } from './xrpl.ledger.methods'


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

    let { account, destination, tag, amount } = message;

    let trans = await RippleTransactionTemplate.payment( { account, destination, tag, amount } );

    return await Wallet.sign(endpoint, trans)
            .then((response) => {
                //console.log(`ResponseData ${JSON.stringify(response.data)}`)
                if(response.data.result === 'success') {
                    emitter.emit('transaction_signer_success', { status: `succeed`, message: `Transaction signed successfully.`});
                    return Promise.resolve({ result: true, blob: response.data.data.tx_blob });
                } else {
                    emitter.emit('transaction_signer_error', { status: `fail`, message: `Failed to sign transaction`});
                    return Promise.resolve({ result: false, error: `Error signing transaction, ${response}` });
                }
            });
    
}


const transaction_submitter = async ({ connection, emitter, blob } = set) => {
    return await SubmitTransaction(connection, emitter, blob);
}

const account_sequence_number = (account) => get_sequence_number(account);

const PaymentValidatorSet = () => { return [ source_account_validator, destination_account_validator ]; }

const TransactionSignerSet = () => { return [ transaction_signer ]; }

const TransactionSubmitterSet = () => { return [ transaction_submitter ]; }

module.exports = {
    PaymentValidatorSet,
    TransactionSignerSet,
    TransactionSubmitterSet
};