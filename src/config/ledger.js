const Promise = require('bluebird')
   , config = require('config')
	, URL = require('url').URL
	, RippleAPI = require('ripple-lib').RippleAPI
	;

var ora = require('ora');

function RippleServer(CLIRPL) {
   this.CLIRPL = CLIRPL;
   this.online = false;
}

RippleServer.prototype.connect = async function(){
   
   var CLIRPL = this.CLIRPL;
	this.online = false;
	
	CLIRPL.spinner.start(`Attempting to connect to ripple ledger at ${CLIRPL.ledger_endpoint}`).start();

   if(CLIRPL.ready){
		await CLIRPL.ripple.connect()
		.then(() => {
			CLIRPL.spinner.succeed(`A ripple ledger at ${CLIRPL.ledger_endpoint} has been found.`);
			//CLIRPL.logger.info(`A ripple ledger at ${CLIRPL.ledger_endpoint} has been found.`);
			this.online = true;
			//CLIRPL.logger.warn(`${CLIRPL.ripple.isConnected()}`);
			return;			
		}).catch((err) => {
			CLIRPL.logger.error(`Failed to connect to ledger at ${CLIRPL.ledger_endpoint}. ${err.code}`);
			this.online = false;
			return;
		});
	}
	
   return new Promise(function(resolve, reject) {
		resolve();
	});
}

module.exports = function(CLIRPL) {

   CLIRPL.ledgerEndpoint = function() {
		CLIRPL.ledger_endpoint = new URL(config.get('ripple_endpoint'));
	};
	CLIRPL.ledgerEndpoint();
	
	CLIRPL.ripple = new RippleAPI({server: CLIRPL.ledger_endpoint.toString()});

	return new Promise(function(resolve, reject) {

		CLIRPL.ready = true;
      CLIRPL.rippleServer = new RippleServer(CLIRPL);
		resolve();
	});
};