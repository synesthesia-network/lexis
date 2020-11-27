const { endpoint } = require(`${__dirname}/config.json`);

const { ApiPromise, WsProvider } = require('@polkadot/api');

async function connect() {
	const wsProvider = new WsProvider(endpoint);
	const api = await ApiPromise.create({ provider: wsProvider });
	console.log(`Connected: ${api.genesisHash.toHex()}`);
	return api;
}

module.exports = {
	connect: connect,
}
