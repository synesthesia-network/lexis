const { checkApi } = require("../connect");
const { getAccount } = require("../utils/get-account");

module.exports = {
	name: 'invite',
	description: 'Invite a user to join Synesthesia.',
	async execute(message, args) {
		if (checkApi(message)) {
			let who = args.shift();
			if (!who) {
				who = message.author.id;
			}

			let target_user = getAccount(who);

			try {
				// Send the actual sudo transaction
				const unsub = await api.tx.sudo
					.sudo(
						api.tx.invite.createAccount(who)
					)
					.signAndSend(sudoPair, (result) => {
						if (result.status.isInBlock) {
							message.channel.send(`Invited User: ${target_user}`);
							unsub();
						}
					 });
			} catch (e) {
				message.channel.send(`Error: ${e.toString()}`)
			}
		}
	},
};
