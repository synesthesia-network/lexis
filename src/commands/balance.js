const { checkApi } = require("../connect");

module.exports = {
	name: 'balance',
	description: 'Get the balance of a user.',
	args: 1,
	usage: '[address]',
	async execute(message, args) {
		if (checkApi(message)) {
			let account = args.shift();

			try {
				let balance = await api.derive.balances.account(account);
				message.channel.send(`Balance of ${account}: ${balance.freeBalance.toHuman()} (${balance.freeBalance.toString()})`);
			} catch(e) {
				message.channel.send(`Error: ${e.toString()}`)
			}
		}
	},
};
