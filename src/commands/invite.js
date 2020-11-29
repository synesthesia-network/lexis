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
					.signAndSend(sudoPair, (result) => {
						if (result.status.isInBlock) {
							message.channel.send(`Invited User: ${user.address}`);
							unsub();
						}
					 });
			} catch (e) {
				message.channel.send(`Error: ${e.toString()}`)
			}
		}
	},
};
