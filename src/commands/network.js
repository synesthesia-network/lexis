const { checkApi } = require('../connect');

module.exports = {
	name: 'network',
	description: 'Get information about the connected network.',
	async execute(message) {
		if (checkApi(message)) {
			let spec_name = api.runtimeVersion.specName.toString();
			let spec_version = api.runtimeVersion.specVersion.toString()
			let impl_version = api.runtimeVersion.implVersion.toString()

			let reply = [];
			reply.push(`**spec_name:** ${spec_name}`);
			reply.push(`**spec_version:** ${spec_version}`);
			reply.push(`**impl_version:** ${impl_version}`);
			reply.push(`**genesis:** ${api.genesisHash.toHex()}`);

			message.channel.send(reply.join('\n'));
		}
	},
};
