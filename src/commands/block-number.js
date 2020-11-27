module.exports = {
	name: 'block-number',
	description: 'Get the latest block number.',
	async execute(message) {
		let header = await api.rpc.chain.getHeader();
		message.channel.send(`#${header.number}: ${header.stateRoot}`);
	},
};
