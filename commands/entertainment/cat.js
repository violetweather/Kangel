const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const axios = require('axios');

module.exports = {
    category: "entertainment",
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('You will receive a random cat, courtesy of Madam Yukong.'),
	async execute(interaction) {

        let catsapi = "https://api.thecatapi.com/v1/images/search"
        let catres = await axios.get(catsapi)

        let embed = new EmbedBuilder()
        .setTitle("meow")
        .setImage(catres.data[0].url)
        .setColor("Random")

        await interaction.reply({embeds: [embed]})
    }
}