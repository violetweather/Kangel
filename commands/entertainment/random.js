const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const axios = require('axios');

module.exports = {
	category: 'entertainment',
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Get a random image of something!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('cat')
                .setDescription('Get a random cat image!'))
        .addSubcommand(subcommand =>
			subcommand
				.setName('dog')
				.setDescription('Get a random dog image!')),     
    async execute(interaction) {
        if(interaction.options.getSubcommand() === 'cat') {
            let catsapi = "https://api.thecatapi.com/v1/images/search"
            let catres = await axios.get(catsapi)
    
            let embed = new EmbedBuilder()
            .setTitle("meow")
            .setImage(catres.data[0].url)
            .setColor("Random")
    
            await interaction.reply({embeds: [embed]})
        }

        if(interaction.options.getSubcommand() === 'dog') {
            let dogsapi = "https://api.thedogapi.com/v1/images/search"
            let dogres = await axios.get(dogsapi)
    
            let embed = new EmbedBuilder()
            .setTitle("woof")
            .setImage(dogres.data[0].url)
            .setColor("Random")
    
            await interaction.reply({embeds: [embed]})
        }
    }
}