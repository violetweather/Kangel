const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Donate to the Magic Smoke Patreon'),
	async execute(interaction) {
        let embed = new EmbedBuilder()
        .setTitle("GIVE ME MONEY.")
        .setDescription("**Kangel** takes a lot of time to develop, on top of the many goals, and ambitions set for the bot and also being a solo project. Donations would be awesome! You'll get some cosmetic rewards from it, soon..")
        .setURL("https://patreon.com/MagicSmokeCommunity")
        .setColor("LuminousVividPink")

        await interaction.reply({embeds:[embed]})
    }
}