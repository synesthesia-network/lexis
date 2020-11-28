const { checkApi } = require("../connect");
const { getAccount } = require("../utils/get-account");

module.exports = {
	name: 'transfer',
	description: 'Make a balance transfer.',
	async execute(message, args) {
		if (checkApi(message)) {
			let to = args.shift();
			let amount = args.shift();
			let from = getAccount(message.author.id);

			try {
				const unsub = await api.tx.sudo
					.sudoAs(
						from,
						api.tx.balances.transfer(to, amount)
					)
					.signAndSend(sudoPair, (result) => {
						if (result.status.isInBlock) {
							message.channel.send(`Transfer Complete`);
							unsub();
						}
					});
			} catch (e) {
				message.channel.send(`Error: ${e.toString()}`)
			}
		}
	},
};
