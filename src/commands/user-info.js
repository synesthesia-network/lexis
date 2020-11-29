const { toSynUser } = require("../utils/user");

module.exports = {
	name: 'user-info',
	aliases: ['me', 'user', 'info'],
	description: 'Display info about a user.',
	usage: '[user (optional)]',
	execute(message, args) {
		let input = args.shift() || message.author.id;
		let user = toSynUser(input);

		let reply = [];
		reply.push(`Username: ${user.user ? user.user.username : "Unknown"}`);
		reply.push(`Discord: ${user.id || "Unknown"}`);
		reply.push(`Address: ${user.address}`);
		message.channel.send(reply.join('\n'));
	},
};
