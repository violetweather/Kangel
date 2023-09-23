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
        await interaction.reply({content: "This command is not usable yet", ephemeral: true})
        // let mention = await interaction.options.getUser('target').fetch({force: true})

        // if(interaction.options.getSubcommand() === 'user') {
        //     const user = await User.findOne({
        //         UserID: mention.id
        //     })

        //     if(user) {
        //         let embed = new EmbedBuilder();

        //         user.Ratings.forEach((item, index) => {
        //             let reviews = `${index+1}. **${item.Author}** **[${item.StarRating}/5 ★]** [**Comment**: ${item.Comment}]`;
        //             embed.setDescription(reviews)

        //             interaction.reply({embeds: [embed]})
        //         })
        //     } else {
        //         let embed = new EmbedBuilder()
        //         .setDescription("No reviews found for the user.")
        //         .setColor("Red")

        //         interaction.reply({embeds: [embed]})
        //     }
        // }
    }
}