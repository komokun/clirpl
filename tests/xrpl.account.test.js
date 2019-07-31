const config                = require('config')
const RippledWsClient       = require('rippled-ws-client');

const chai = require("chai");
const expect = chai.expect;

var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

const LedgerAccount     = require('../src/api/xrpl.account');
const account_fixtures      = require('./fixtures/account.json');

let wsconnection    = null;

describe("Ledger Accounts Tests", function() {

   this.timeout(20000); // This works only if ES6 is not used to instance the function.

   it("Validate existing account.", async () => {
        var spy = sinon.spy();
        let existing = account_fixtures.existing;

        let accountset = { 
            message: existing.content,  
            ws: wsconnection, vault: vault,
            validators: null, errors: []  
        };

        const account = new LedgerAccount(accountset);

        account.on('validate_account_success', spy);

        const validated = account.validator();
        let result = null;
        await validated.then((res) => { result = res; });
        
        expect(result.result).to.equal('success');
        spy.should.have.been.calledTwice;

    })

})