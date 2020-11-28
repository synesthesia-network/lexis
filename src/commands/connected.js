const { checkApi } = require('../connect');

module.exports = {
	name: 'connected',
	description: 'Get information about the connected network.',
	async execute(message) {
		if (checkApi(message)) {
			let spec_name = api.runtimeVersion.specName.toString();
			let spec_version = api.runtimeVersion.specVersion.toString()
			let impl_version = api.runtimeVersion.implVersion.toString()

			message.channel.send(
				`Connected to:\n\tspec_name: ${spec_name}\n\tspec_version: ${spec_version}\n\timpl_version: ${impl_version}\n\tgenesis: ${api.genesisHash.toHex()}`
			);
		}
	},
};
