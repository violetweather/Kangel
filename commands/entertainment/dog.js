const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const axios = require('axios');

module.exports = {
    category: "entertainment",
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('You will receive a random dog, courtesy of Madam Yukong.'),
	async execute(interaction) {

        let dogsapi = "https://api.thedogapi.com/v1/images/search"
        let dogres = await axios.get(dogsapi)

        let embed = new EmbedBuilder()
        .setTitle("woof")
        .setImage(dogres.data[0].url)
        .setColor("Random")

        await interaction.reply({embeds: [embed]})
    }
}