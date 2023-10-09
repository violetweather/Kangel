const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const User = require('../../Schemas.js/rateSchema')
const logger = require('../../logger');
const Server = require('../../Schemas.js/guildRateSchema')

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reviews')
		.setDescription('Get the latest reviews for a user/server')
        .addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('See user reviews')
                .addUserOption(
                    option => option.setName('target').setDescription('Find reviews for a specific user').setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('See server reviews')
                ).setDMPermission(false),
	async execute(interaction) {
        if(interaction.options.getSubcommand() === 'user') {
            let mention = await interaction.options.getUser('target').fetch({force: true})
            const user = await User.findOne({
                UserID: mention.id
            })

            if(user) {
                let reviews = [];
                await user.Ratings.forEach(async ratings => {
                    reviews.push(`**Review Author**: ${ratings.Author} \n **Review ID**: ${ratings._id} \n **Review Rating**: ★${ratings.StarRating} \n **Review Comment**: ${ratings.Comment}`)
                });

                const embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTimestamp()
                .setTitle(`Reviews for ${mention.username}`)
                .setDescription(reviews.join('\n \n').slice(0, 2000))
        
                await interaction.reply({embeds: [embed]});
            } else {
                let embed = new EmbedBuilder()
                .setDescription("No reviews found for the user.")
                .setColor("Red")

                return interaction.reply({embeds: [embed]})
            }
        }

        if(interaction.options.getSubcommand() === 'server') {
            const server = await Server.findOne({
                ServerID: interaction.guild.id
            })

            if(server) {
                let reviews = [];
                await server.Ratings.forEach(async ratings => {
                    reviews.push(`**Review Author**: ${ratings.Author} \n **Review ID**: ${ratings._id} \n **Review Rating**: ★${ratings.StarRating} \n **Review Comment**: ${ratings.Comment}`)
                });

                const embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTimestamp()
                .setTitle(`Reviews for ${interaction.guild.name}`)
                .setDescription(reviews.join('\n \n').slice(0, 2000))
        
                await interaction.reply({embeds: [embed]});
            } else {
                let embed = new EmbedBuilder()
                .setDescription("No reviews found for the server.")
                .setColor("Red")

                return interaction.reply({embeds: [embed]})
            }
        }
    }
}