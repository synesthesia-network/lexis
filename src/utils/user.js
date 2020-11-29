const { blake2AsU8a, encodeAddress } = require('@polkadot/util-crypto');
const { stringToU8a } = require('@polkadot/util');

// Convert a discord id to an address. Matches on-chain logic.
function idToAddress(id) {
	let entropy = "syn/invite";
	let entropyBytes = stringToU8a(entropy);

	// Kind of a dumb hack to add the length prefix to the encoded id
	let id_vec = api.createType("Vec<u8>", id);
	let idBytes = id_vec.toU8a();

	let combinedBytes = new Uint8Array(entropyBytes.length + idBytes.length);
	combinedBytes.set(entropyBytes);
	combinedBytes.set(idBytes, entropyBytes.length);

	let hash = blake2AsU8a(combinedBytes, 256);
	let address = encodeAddress(hash);

	return address
}

function mentionToId(mention) {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return id;
}

// This function will attempt to convert some input into a synesthesia user.
// Input can be: address, mention, or discord id.
// Synesthesia user will have all of these properties in one object.
function toSynUser(input) {
	let synUser = {
		// Discord Id
		id: null,
		// Synesthesia Address
		address: null,
		// Discord JS User Object
		user: null,
	};

	// Check if mention
	let maybeId = mentionToId(input);
	if (maybeId) {
		// Input is now a discord id, and will be converted further below.
		input = maybeId;
	}

	// Check if discord id
	if (client.users.cache.has(input)) {
		synUser.id = input;
		synUser.address = idToAddress(input);
		synUser.user = client.users.cache.get(input);
		// early exit
		return synUser;
	}

	// Check if address
	try {
		let address = encodeAddress(input);
		synUser.address = address;
		// TODO: From address derive the other properties.
	} catch (e) {
		// do nothing for now
	}

	return synUser;
}

module.exports = {
	idToAddress,
	mentionToId,
	toSynUser,
};
