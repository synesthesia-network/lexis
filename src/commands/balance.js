const { checkApi } = require("../connect");
const { toSynUser } = require("../utils/user");

module.exports = {
	name: 'balance',
	description: 'Get the balance of a user.',
	usage: '[user (optional)]',
	async execute(message, args) {
		if (checkApi(message)) {
			let input = args.shift() || message.author.id;
			let user = toSynUser(input);

			if (!user.address) {
				return message.channel.send(`Could not derive address from input.`)
			}

			try {
				let balance = await api.derive.balances.account(user.address);
				return message.channel.send(`Balance of ${user.address}: ${balance.freeBalance.toHuman()} (${balance.freeBalance.toString()})`);
			} catch(e) {
				return message.channel.send(`Error: ${e.toString()}`);
			}
		}
	},
};
