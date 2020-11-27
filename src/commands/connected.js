module.exports = {
	name: 'connected',
	description: 'Get information about the connected network.',
	async execute(message) {
		message.channel.send(`Connected to: ${api.genesisHash.toHex()}`);
	},
};
