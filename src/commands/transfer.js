const { checkApi } = require("../connect");
const { idToAddress, toSynUser } = require("../utils/user");
const BN = require("bn.js");

module.exports = {
	name: 'transfer',
	description: 'Make a balance transfer.',
	args: 2,
	usage: '[address] [amount]',
	async execute(message, args) {
		if (checkApi(message)) {
			let to_input = args.shift();
			let amount = args.shift();
			let from = idToAddress(message.author.id);

			let to_user = toSynUser(to_input);

			if (!to_user.address) {
				return message.channel.send(`Could not derive address from input.`);
			}

			try {
				amount = new BN(amount);
			} catch (e) {
				return message.channel.send(`Could not convert amount to BN: ${e.toString()}`);
			}

			try {
				const unsub = await api.tx.sudo
					.sudoAs(
						from,
						api.tx.balances.transfer(to_user.address, amount)
					)
					.signAndSend(sudoPair, { nonce: -1 }, ({ status, events }) => {
						if (status.isInBlock) {
							events
								// We know this tx should result in `SudoAsDone` event.
								.filter(({ event: { section, method } }) =>
									section === 'sudo' &&
									method === 'SudoAsDone'
								)
								// We know `SudoAsDone` returns just a `result`
								.forEach(({ event: { data: [result] } }) => {
									if (result.isFalse) {
										message.react('❌');
									} else if (result.isTrue) {
										message.react('✅');
									}
								});
							unsub();
						}
					});
			} catch (e) {
				return message.channel.send(`Error: ${e.toString()}`);
			}
		}
	},
};
