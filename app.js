require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const logger = require('./logger');

const kangel = new Client({ intents: [Object.keys(GatewayIntentBits)] });

kangel.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			kangel.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		kangel.once(event.name, (...args) => event.execute(...args));
	} else {
		kangel.on(event.name, (...args) => event.execute(...args));
	}
}

kangel.cooldowns = new Collection();

kangel.on(Events.ClientReady, () => logger.info('The bot is online'));
kangel.on(Events.Debug, m => logger.debug(m));
kangel.on(Events.Warn, m => logger.warn(m));
kangel.on(Events.Error, m => logger.error(m));

kangel.login(process.env.TOKEN)