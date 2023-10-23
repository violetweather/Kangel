const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const guildSetupSchema = require('../../Schemas.js/guild_setup')

module.exports = {
	category: 'setup',
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Configure your server with moderation features and knd')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	    .setDMPermission(false)
        .addChannelOption(option => 
            option.setName('logs')
            .setDescription('Select a logs channel for general moderation logs')
            .setRequired(true))
        .addBooleanOption(option => 
            option.setName('knd')
            .setDescription('Global ban system synced to you (or an authoritative).'))
        .addBooleanOption(option => 
            option.setName('knd_auto')
            .setDescription('Make bans automatically be sent to knd or make knd optional.')),
	async execute(interaction) {
        const logChannel = interaction.options.getChannel("logs")
        const embed = new EmbedBuilder()

        let data = guildSetupSchema.findOne({ GuildID: interaction.guild.id })

        if(!data) {
            return interaction.reply({content: "Still testing this.. come back later", ephemeral: true})
        }
    }
}