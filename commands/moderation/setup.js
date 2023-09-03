const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 5,
	category: 'setup',
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Configure your server with moderation features and YI2E')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	    .setDMPermission(false)
        .addChannelOption(option => 
            option.setName('logs')
            .setDescription('Select a logs channel for general moderation logs and YI2E')
            .setRequired(true))
        .addBooleanOption(option => 
            option.setName('yi2e')
            .setDescription('Global ban system synced to you (or an authoritative).'))
        .addBooleanOption(option => 
            option.setName('yi2e_auto')
            .setDescription('Make bans automatically be sent to YI2E or make YI2E optional.')),
	async execute(interaction) {

    }
}