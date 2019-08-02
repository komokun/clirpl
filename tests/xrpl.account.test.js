const config            = require('config');
const RippledWsClient   = require('rippled-ws-client');
const console2          = require('console2')({disableWelcome: true, override: false});
const chai              = require("chai");
const expect            = chai.expect;

var sinon               = require("sinon");
var sinonChai           = require("sinon-chai");
chai.should();
chai.use(sinonChai);

const LedgerAccount         = require('../src/api/xrpl.account');
const account_fixtures      = require('./fixtures/accounts.json');

let wsconnection    = null;

describe("Ledger Accounts Tests", function() {

   this.timeout(20000); // This works only if ES6 is not used to instantiate the function.

   before( async () => {

        let ripplews = new RippledWsClient(config.get('ripple_endpoint'));

        await ripplews
		.then((connection) => {
            wsconnection = connection
			console2.info(`A ripple ledger at ${config.get('ripple_endpoint')} has been found.`);
		}).catch((err) => {
            console2.error(`Failed to connect to ledger at ${config.get('ripple_endpoint')}. ${err}`);
        });
        
    });

   it("Validate existing account.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('validate_account_success', spy);

        const validated = account.validate();
        let result = null;
        await validated.then((res) => { result = res; });

        expect(result.result).to.equal('success');
        spy.should.have.been.calledOnce;
    })

    it("Validate and fail on badly formed account.", async () => {
        var spy = sinon.spy();
        let malformed = account_fixtures.malformed;

        //console.log(`Malformed ${JSON.stringify(malformed)}`);

        let accountset = { account: malformed.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('validate_account_error', spy);

        const validated = account.validate();
        let result = null;
        await validated.then((res) => { result = res; });
        
        //console.log(result);
        expect(result.result).to.equal('failure');
        expect(result.errors).to.have.lengthOf.greaterThan(0); 
        spy.should.have.been.calledOnce;
    })

    it("Retrieve account transactions.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('account_transaction_query_success', spy);

        const txs = account.transactions();
        let result = null;
        await txs.then((res) => { result = res; });

        expect(result.result).to.equal('success');
        expect(result.transactions.count).to.be.greaterThan(0);
        spy.should.have.been.calledOnce;
    })

    it("Retrieve account currencies.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('account_currencies_query_success', spy);

        const currencies = account.currencies();
        let result = null;
        await currencies.then((res) => { result = res; });

        expect(result.result).to.equal('success');
        expect(result.currencies.send).to.exist;
        expect(result.currencies.receive).to.exist;
        spy.should.have.been.calledOnce;
    })

    it("Retrieve account objects.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('account_objects_query_success', spy);

        const objects = account.objects();
        let result = null;
        await objects.then((res) => { result = res; });

        expect(result.result).to.equal('success');
        expect(result.objects).to.exist; 
        expect(result.objects).to.have.lengthOf.greaterThan(0); 
        spy.should.have.been.calledOnce;
    })

    it("Retrieve account offers.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('account_offers_query_success', spy);

        const offers = account.offers();
        let result = null;
        await offers.then((res) => { result = res; });

        //console.log(JSON.stringify(result));
        expect(result.result).to.equal('success');
        expect(result.offers).to.exist; 
        spy.should.have.been.calledOnce;
    })

    it("Retrieve account channels.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { account: existing.content.account, counterparty: existing.content.counterparty, ws: wsconnection };

        const account = new LedgerAccount(accountset);

        account.on('account_channels_query_success', spy);

        const channels = account.channels();
        let result = null;
        await channels.then((res) => { result = res; });

        //console.log(JSON.stringify(result));
        expect(result.result).to.equal('success');
        expect(result.channels).to.exist;
        spy.should.have.been.calledOnce;
    })

})
