const { checkApi } = require("../connect");
const { idToAddress, toSynUser } = require("../utils/user");

module.exports = {
	name: 'invite',
	description: 'Invite a user to join Synesthesia.',
	args: 1,
	usage: '[user]',
	async execute(message, args) {
		if (checkApi(message)) {
			let input = args.shift();

			let user = toSynUser(input);

			if (!user.id) {
				return message.channel.send(`Could not derive Discord ID from input.`);
			}

			try {
				// Send the actual sudo transaction
				const unsub = await api.tx.sudo
					.sudo(
						api.tx.invite.createAccount(user.id)
					)
					.signAndSend(sudoPair, { nonce: -1 }, ({ status, events }) => {
						if (status.isInBlock) {
							events
								// We know this tx should result in `Sudid` event.
								.filter(({ event: { section, method } }) =>
									section === 'sudo' &&
									method === 'Sudid'
								)
								// We know that `Sudid` returns just a `result`
								.forEach(({ event : { data: [result] } }) => {
									if (result.isError) {
										let error = result.asError;
										if (error.isModule) {
											// Module Error Information
											const decoded = api.registry.findMetaError(error.asModule);
											const { documentation, name, section } = decoded;

											message.react('❌');
											message.channel.send(`Module Error: ${section}.${name}: ${documentation.join(' ')}`);
										} else {
											// Other, CannotLookup, BadOrigin, no extra info
											message.react('❌');
											message.channel.send(`Dispatch Error: ${error.toString()}`);
										}
									} else if (result.isOk) {
										message.react('✅');
										message.channel.send(`Invited User: ${user.address}`);
									}
								});
							unsub();
						}
					 });
			} catch (e) {
				message.channel.send(`Error: ${e.toString()}`)
			}
		}
	},
};
