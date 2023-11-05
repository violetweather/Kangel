const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const User = require('../../Schemas.js/rateSchema')
const logger = require('../../logger');
const Server = require('../../Schemas.js/guildRateSchema')
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');

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
                let embeds = [];

                await user.Ratings.forEach(async ratings => {
                    reviews.push(`**Review Author**: ${ratings.Author} \n **Review ID**: ${ratings._id} \n **Review Rating**: ★${ratings.StarRating} \n **Review Comment**: ${ratings.Comment}`)
                });


                for (let i = 0; i <= reviews.length-1; i++) {
                    let embed = new EmbedBuilder()
                    embed.setColor("LuminousVividPink")
                    embed.setTimestamp()
                    embed.setTitle(`Reviews for ${mention.username}`)
                    embed.setDescription(`${reviews[i]}`)

                    embeds.push(embed)
                }

                await pagination({
                    embeds: embeds, /** Array of embeds objects */
                    author: interaction.member.user,
                    interaction: interaction,
                    ephemeral: false,
                    time: 40000, /** 20 seconds */
                    disableButtons: true, /** Remove buttons after timeout */
                    fastSkip: false,
                    pageTravel: false,
                    buttons: [
                        {
                            type: ButtonTypes.previous,
                            label: 'Previous Page',
                            style: ButtonStyles.Primary
                        },
                        {
                            type: ButtonTypes.next,
                            label: 'Next Page',
                            style: ButtonStyles.Success
                        }
                    ]
                });
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
                let embeds = [];
                let reviews = [];
                await server.Ratings.forEach(async ratings => {
                    reviews.push(`**Review Author**: ${ratings.Author} \n **Review ID**: ${ratings._id} \n **Review Rating**: ★${ratings.StarRating} \n **Review Comment**: ${ratings.Comment}`)
                });

                for (let i = 0; i <= reviews.length-1; i++) {
                    let embed = new EmbedBuilder()
                    .setColor("LuminousVividPink")
                    .setTimestamp()
                    .setTitle(`Reviews for ${interaction.guild.name}`)
                    .setDescription(`${reviews[i]}`)

                    embeds.push(embed)
                }

                await pagination({
                    embeds: embeds, /** Array of embeds objects */
                    author: interaction.member.user,
                    interaction: interaction,
                    ephemeral: false,
                    time: 40000, /** 20 seconds */
                    disableButtons: true, /** Remove buttons after timeout */
                    fastSkip: false,
                    pageTravel: false,
                    buttons: [
                        {
                            type: ButtonTypes.previous,
                            label: 'Previous Page',
                            style: ButtonStyles.Primary
                        },
                        {
                            type: ButtonTypes.next,
                            label: 'Next Page',
                            style: ButtonStyles.Success
                        }
                    ]
                });
            } else {
                let embed = new EmbedBuilder()
                .setDescription("No reviews found for the server.")
                .setColor("Red")

                return interaction.reply({embeds: [embed]})
            }
        }
    }
}