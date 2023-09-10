const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const guildSetupSchema = require('../../Schemas.js/guild_setup')

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
            .setDescription('Select a logs channel for general moderation logs')
            .setRequired(true))
        .addBooleanOption(option => 
            option.setName('yi2e')
            .setDescription('Global ban system synced to you (or an authoritative).'))
        .addBooleanOption(option => 
            option.setName('yi2e_auto')
            .setDescription('Make bans automatically be sent to YI2E or make YI2E optional.')),
	async execute(interaction) {
        const logChannel = interaction.options.getChannel("logs")
        const embed = new EmbedBuilder()

        let data = guildSetupSchema.findOne({ GuildID: interaction.guild.id })

            if(!data) {
                await guildSetupSchema.create({
                    GuildID: interaction.guild.id,
                    LogChannelID: logChannel.id
                });

                embed.setDescription("Your logs channel has been successfully updated.")
                .setColor("Green")
                .setTimestamp();
            } else if(data) {
                guildSetupSchema.findOneAndDelete({ GuildID: interaction.guild.id});
                await guildSetupSchema.create({
                    GuildID: interaction.guild.id,
                    LogChannelID: logChannel.id
                })

              embed.setDescription("Your logs channel has been successfully updated.")
                .setColor("Green")
                .setTimestamp();  
            }

            return interaction.reply({embeds: [embed], ephemeral: true})
    }
}