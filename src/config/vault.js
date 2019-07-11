const shell = require('shelljs')
	, console2 = require('console2')({disableWelcome: true, override: false})
   , Promise = require('bluebird')
   , config = require('config')
   , axios = require('axios')
   ;
   
function VaultServer(CLIRPL) {
   this.CLIRPL = CLIRPL;
   this.online = false;
}

VaultServer.prototype.ping = async function(){
   
   var CLIRPL = this.CLIRPL;
   this.online = false;
   if(CLIRPL.ready){
      const vault = await axios.get(CLIRPL.vault_endpoint.toString());
      (vault.data.result == 'success') ?  this.online = true : this.online = false;
   }
   return new Promise(function(resolve, reject) {
		resolve();
	});
}

VaultServer.prototype.start = function(){
   var CLIRPL = this.CLIRPL;

   if(CLIRPL.ready){
      // Run external tool synchronously
      if (shell.exec('sudo systemctl start xrplkd.service').code !== 0) {
         CLIRPL.logger.warn('Vault service failed to start.');
         shell.echo('Error: Failed to start xrplkd service.');
         shell.exit(1);
      } else {

         CLIRPL.logger.warn('Vault service daemon has been started.');
      }
   }
}

VaultServer.prototype.stop = function(){
   var CLIRPL = this.CLIRPL;

   if(CLIRPL.ready){
      // Run external tool synchronously
      if (shell.exec('sudo systemctl stop xrplkd.service').code !== 0) {
         shell.echo('Error: Failed to stop xrplkd service.');
         shell.exit(1);
      } else {

         CLIRPL.logger.warn('Vault service has been stopped');
      }
   }
}

module.exports = function(CLIRPL) {

   CLIRPL.vaultEndpoint = function() {
		let _url = new URL('http://localhost');
		_url.host = config.get('vault_host');
		_url.port = config.get('vault_port');
		_url.pathname = config.get('vault_pathname');
		
		CLIRPL.vault_endpoint = _url;
	}
   CLIRPL.vaultEndpoint();

	return new Promise(function(resolve, reject) {

      CLIRPL.ready = true;
      CLIRPL.vaultServer = new VaultServer(CLIRPL);

      CLIRPL.vaultServer.start();

		resolve();
	});
};