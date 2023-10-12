const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription('Get the information on the latest Kangel build.'),
	async execute(interaction) {
        let channel = await interaction.client.channels.cache.get("1155395911778832446")
        let msgs = await channel.messages.fetch()

        let embed = new EmbedBuilder()
        .setColor("LuminousVividPink")
        .setDescription(msgs.first().content)

        interaction.reply({embeds:[embed]})
    }
}