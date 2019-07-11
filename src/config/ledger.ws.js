const Promise = require('bluebird')
   , config = require('config')
	, URL = require('url').URL
	;

var ora = require('ora');
const RippledWsClient = require('rippled-ws-client');


function RippleWsServer(CLIRPL) {
   this.CLIRPL = CLIRPL;
   this.online = false;
}

RippleWsServer.prototype.connect = async function(){
   
   var CLIRPL = this.CLIRPL;
	this.online = false;
	
	CLIRPL.spinner.start(`Attempting a ws connection to ripple ledger at ${CLIRPL.ledger_endpoint}`).start();

   if(CLIRPL.ready){
		await CLIRPL.ripple
		.then((connection) => {
         CLIRPL.wsconnection = connection
			CLIRPL.spinner.succeed(`A ripple ledger at ${CLIRPL.ledger_endpoint} has been found.`);
			this.online = true;
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
	
	CLIRPL.ripple = new RippledWsClient('wss://s1.ripple.com');//new RippleAPI({server: CLIRPL.ledger_endpoint.toString()});

	return new Promise(function(resolve, reject) {

		CLIRPL.ready = true;
      CLIRPL.wsServer = new RippleWsServer(CLIRPL);
		resolve();
	});
};