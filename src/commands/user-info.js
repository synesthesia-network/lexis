const { getAccount } = require("../utils/get-account");

module.exports = {
	name: 'user-info',
	aliases: ['me', 'user', 'info'],
	description: 'Display info about a user.',
	execute(message) {
		let reply = [];
		reply.push(`Your username: ${message.author.username}`);
		reply.push(`Your ID: ${message.author.id}`);
		reply.push(`Your Synesthesia Address: ${getAccount(message.author.id)}`)
		message.channel.send(reply.join('\n'));
	},
};
