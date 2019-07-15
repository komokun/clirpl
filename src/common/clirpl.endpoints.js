
export const WalletEndpoints = {

   ping: () => {
      return new URL(url()).toString();
	},
	
	list: () => {
		let _url = url();
		const path = _url.pathname + '/wallet/list';
		return new URL(path, url()).toString();
	},

	create: () => {
		let _url = url();
		const path = _url.pathname + '/wallet/create';
		return new URL(path, url()).toString();
	},

	lock: (name) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/lock`;
		return new URL(path, url()).toString();
	},

	unlock: (name, pass) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/unlock/${pass}`;
		return new URL(path, url()).toString();
	},

	keypair: () => {
		let _url = url();
		const path = `${_url.pathname}/wallet/keypair`;
		return new URL(path, url()).toString();
	},

	add: (name, seed) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/addkey/${seed}`;
		return new URL(path, url()).toString();
	},

	addresses: (name) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/keys`;
		return new URL(path, url()).toString();
	},

	sign_transaction: (name) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/sign/transaction`;
		return new URL(path, url()).toString();
	},

	sign_message: (name) => {
		let _url = url();
		const path = `${_url.pathname}/wallet/${name}/sign/message`;
		return new URL(path, url()).toString();
	}
};

function url () {

	let _url = new URL('http://localhost');
	_url.host = config.get('vault_host');
	_url.port = config.get('vault_port');
	_url.pathname = config.get('vault_pathname');

	return _url;
}