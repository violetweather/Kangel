const { Events, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require("ms")
const cooldownDB = require('../Schemas.js/cooldowns')
const pollSchema = require('../Schemas.js/pollSchema')


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if(command.owner) {
			if(interaction.user.id !== "785682850274869308") return await interaction.reply({content: "You are not authorized to run this command.", ephemeral: true})
		}

		if (!command) {
			await interaction.reply({ content: `No command matching ${interaction.commandName} was found or you do not have sufficient permissions.`, ephemeral: true})
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};