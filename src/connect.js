const { endpoint } = require('../config.json');
const types = require('../types.json')

const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

async function connect() {
	const wsProvider = new WsProvider(endpoint);
	const api = await ApiPromise.create({ provider: wsProvider, types });
	console.log(`Connected: ${api.genesisHash.toHex()}`);
	return api;
}

function enableSudo() {
	const keyring = new Keyring({ type: 'sr25519' });
	const sudo = keyring.addFromUri(process.env.SUDO_KEY, { name: 'Sudo User' });
	return sudo;
}

function checkApi(message) {
	if (typeof api === 'undefined') {
		message.channel.send(`Not connected to API.`)
		return false;
	}

	return true;
}

module.exports = {
	connect,
	checkApi,
	enableSudo,
}
