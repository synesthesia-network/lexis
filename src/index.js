
require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('../config.json');
const { connect, enableSudo } = require(`${__dirname}/connect.js`);

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

async function main() {
	// Connect through Polkadot.JS and place into global scope.
	global.api = await connect();
	// Set up the sudo account
	global.sudoPair = enableSudo();
	// Login to discord
	client.login(process.env.DISCORD_TOKEN);
}

main();
