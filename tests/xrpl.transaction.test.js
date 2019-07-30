const config                = require('config')
	, RippleAPI             = require('ripple-lib').RippleAPI
const RippledWsClient       = require('rippled-ws-client');

const clui = require('clui')
	, Spinner = clui.Spinner
    , console2 = require('console2')({disableWelcome: true, override: false})

const chai = require("chai");
const expect = chai.expect;

var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

const LedgerTransaction     = require('../src/api/xrpl.transaction');
const payment_fixtures      = require('./fixtures/payment.json');

let wsconnection    = null;
let apiconnection   = null;
let vault           = '';

const delay = ms => new Promise(_ => setTimeout(_, ms));

describe("Ledger Transaction Tests", function() {

    this.timeout(20000); // This works only if ES6 is not used to instance the function.

    before( async () => {

        // Set up vault URL.
        let _url = new URL('http://localhost');
		_url.host = config.get('vault_host');
		_url.port = config.get('vault_port');
		_url.pathname = config.get('vault_pathname');
        let vault = _url;
        // var spinner = new Spinner('Starting Ripple Command Line Application...');

        let ripplews = new RippledWsClient(config.get('ripple_endpoint'));
        //let rippleapi = new RippleAPI({server: config.get('ripple_endpoint').toString()});

        await ripplews
		.then((connection) => {
            wsconnection = connection
			console2.info(`A ripple ledger at ${config.get('ripple_endpoint')} has been found.`);
		}).catch((err) => {
            console2.error(`Failed to connect to ledger at ${config.get('ripple_endpoint')}. ${err}`);
        });
        
        /*
        await rippleapi.connect()
		.then(() => {
            apiconnection = rippleapi;
            console2.info(`A ripple api at ${config.get('ripple_endpoint')} has been found.`);
		}).catch((err) => {
            console2.error(`Failed to connect to api at ${config.get('ripple_endpoint')}. ${err}`);
        });
        */


    });

    it("Validate payment accounts.", async () => {
        var spy = sinon.spy();
        let native_payment = payment_fixtures.native;

        let ledgerset  = { 
                            message: native_payment.content, object: null, 
							    api: apiconnection, ws: wsconnection, vault: vault,
                                    validators: null, errors: [] 
                         };

        const transaction = new LedgerTransaction(ledgerset);

        transaction.on('validate_account_success', spy);

        const validated = transaction.validator();
        let result = null;
        await validated.then((res) => {
            result = res;     
        });
        
        expect(result.result).to.equal('success');
        spy.should.have.been.calledTwice;

    })

    it("Validate payment with a wrong account.", async () => {

        var spy = sinon.spy();
        let native_payment = payment_fixtures.native_with_wrong_account;
        let ledgerset  = { 
                            message: native_payment.content, object: null, 
							    api: apiconnection, ws: wsconnection, vault: vault,
                                    validators: null, errors: [] 
                         };

        const transaction = new LedgerTransaction(ledgerset)
        transaction.on('validate_account_error', spy);
        const validated = transaction.validator();
        let result = null;
        await validated.then((res) => {
            result = res;     
        });
        
        expect(result.result).to.equal('failure');
        expect(result.errors).to.have.lengthOf.greaterThan(0); 
        spy.should.have.been.calledOnce;

    })

    it("Execute a native payment.", async () => {

        var spy = sinon.spy();
        let native_payment = payment_fixtures.native;
        let ledgerset = { 
                            message: native_payment.content, object: null, 
							    api: apiconnection, ws: wsconnection, vault: vault,
                                    validators: null, errors: [] 
                        };

        const transaction = new LedgerTransaction(ledgerset);
        transaction.on('validate_account_success', spy);
        transaction.on('transaction_signer_success', spy);
        const executed = transaction.execute();
        let result = null;
        await executed.then((res) => {
            result = res;     
        });

        expect(result.result).to.equal('success'); 
        spy.should.have.been.calledThrice;
    })

});