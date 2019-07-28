const axios = require('axios')
, config = require('config')
;

import { RippleAccountPretty } from '../pretty/ripple.account.pretty'
import { RippleTransactions } from './ripple.transactions.command'
import { WalletEndpoints } from '../common/clirpl.endpoints'

module.exports = function(CLIRPL) {
	
   CLIRPL.vorpal
   	.command('ping vault', 'Ping vault for signs of life.')
   	.action(async function(args, callback) {
         const vault = await axios.get(WalletEndpoints.ping());
         CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
         callback();
	});

	CLIRPL.vorpal
		.command('create wallet', 'Create a new wallet.')
		.option('-n, --name')
   	.action(async function(args, callback) {
			let name = 'bag';
			try {
    		   const vault = await axios.post(WalletEndpoints.create(), {name: name});
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.response.data)}`);
			}
         callback();
   });

	CLIRPL.vorpal
   	.command('list wallets', 'List of available wallets.')
   	.action(async function(args, callback) {
         const vault = await axios.get(WalletEndpoints.list());
         CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
         callback();
	});
	
	CLIRPL.vorpal
		.command('lock', 'Lock a specified wallet.')
		.option('-n --name [name]')
   	.action(async function(args, callback) {
			try {
    		   const vault = await axios.put(WalletEndpoints.lock(args.options.name));
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.code)}`);
			}
         callback();
	});
	
	CLIRPL.vorpal
		.command('unlock', 'Unlock a specified wallet.')
		.option('-n --name [name]')
		.option('-p --password [password]')
   	.action(async function(args, callback) {
			try {
    		   const vault = await axios.put(WalletEndpoints.unlock(args.options.name, args.options.password));
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.code)}`);
			}
         callback();
	});
	
	CLIRPL.vorpal
		.command('key pair', 'Return a new ripple ledger key pair.')
   	.action(async function(args, callback) {
			try {
    		   const vault = await axios.get(WalletEndpoints.keypair());
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.code)}`);
			}
         callback();
   });

	CLIRPL.vorpal
		.command('add key', 'Add secret signing key a specified wallet.')
		.alias('add seed')
		.option('-n --name [name]')
		.option('-s --secret [secret]')
   	.action(async function(args, callback) {
			try {
    		   const vault = await axios.put(WalletEndpoints.add(args.options.name, args.options.secret));
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.code)}`);
			}
         callback();
	});
	
	CLIRPL.vorpal
		.command('list keys', 'List addresses stored in a specified wallet.')
		.option('-n --name [name]')
   	.action(async function(args, callback) {
			try {
    		   const vault = await axios.get(WalletEndpoints.addresses(args.options.name));
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.code)}`);
			}
         callback();
   });
	
	CLIRPL.vorpal
		.command('sign message', 'Sign a message using one of available keys.')
		.option('-n --name [name]') // Name of unlocked wallet
		.option('-a --address [address]')
		.option('-m --message [message]')
   	.action(async function(args, callback) {
			try {
				const vault = await 
									axios.post(WalletEndpoints.sign_message(args.options.name), 
				 						  { address: args.options.address, message: args.options.message });
				CLIRPL.logger.info(`${JSON.stringify(vault.data)}`);
			} catch (error) {
				CLIRPL.logger.info(`${JSON.stringify(error.response.data)}`);
			}
         callback();
   });

	return new Promise(function(resolve, reject) {
		resolve();
	});
} 
