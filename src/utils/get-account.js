const { blake2AsU8a, encodeAddress } = require('@polkadot/util-crypto');
const { stringToU8a } = require('@polkadot/util');

// Convert a seed to an account id. Matches logic on-chain.
function getAccount(seed) {
	let entropy = "syn/invite";
	let entropyBytes = stringToU8a(entropy);

	// Kind of a dumb hack to add the length prefix to the encoded seed
	let seed_vec = api.createType("Vec<u8>", seed);
	let seedBytes = seed_vec.toU8a();

	let combinedBytes = new Uint8Array(entropyBytes.length + seedBytes.length);
	combinedBytes.set(entropyBytes);
	combinedBytes.set(seedBytes, entropyBytes.length);

	let hash = blake2AsU8a(combinedBytes, 256);
	let address = encodeAddress(hash);

	return address
}

module.exports = {
	getAccount,
};
