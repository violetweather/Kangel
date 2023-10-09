const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const User = require('../../Schemas.js/rateSchema')
const Server = require('../../Schemas.js/guildRateSchema')

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report something within the bot, abuse may result in blacklisting from report system.')
        .addSubcommand(subcommand =>
			subcommand
				.setName('review')
				.setDescription('Report a review!')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type of review.')
                        .setRequired(true)
                        .addChoices(
                                {name: 'Guild', value: 'server'},
                                {name: 'User', value: 'user'}
                            ))
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('Review ID you want to report, can be found in /reviews.')
                        .setRequired(true))),
    async execute(interaction) {
        const reportID = interaction.options.getString("id")

        if(interaction.options.getString("type") === 'user') {
            const user = await User.findOne({"Ratings._id": `${reportID}`})
            let ratingFound = user.Ratings[0]

            if(user) {
                interaction.reply({content: `Your report for ${interaction.options.getString("id")} was submitted.`, ephemeral: true})

                let embed = new EmbedBuilder()
                .setTitle("Report")
                .setColor("Red")
                .addFields(
                    { name: "Rating Author ID", value: `${ratingFound.AuthorID}`, inline: true},
                    { name: "Rating Author Username", value: `${ratingFound.Author}`, inline: true},
                    { name: "Rating Comment", value: `${ratingFound.Comment}`},
                    { name: "Reported by", value: `${interaction.user.username} (${interaction.user.id})`}
                )

                let channelReports = interaction.client.channels.cache.get("1160764565240430644")
                return channelReports.send({embeds: [embed]})
            } else {
                return interaction.reply({content: "Review ID could not be found..", ephemeral: true})
            }
        }

        if(interaction.options.getString("type") === 'server') {
            const server = await Server.findOne({"Ratings._id": `${reportID}`})
            let ratingFound = server.Ratings[0]

            if(server) {
                interaction.reply({content: `Your report for ${interaction.options.getString("id")} was submitted.`, ephemeral: true})

                let embed = new EmbedBuilder()
                .setTitle("Report")
                .setColor("Red")
                .addFields(
                    { name: "Rating Author ID", value: `${ratingFound.AuthorID}`, inline: true},
                    { name: "Rating Author Username", value: `${ratingFound.Author}`, inline: true},
                    { name: "Rating Comment", value: `${ratingFound.Comment}`},
                    { name: "Reported by", value: `${interaction.user.username} (${interaction.user.id})`}
                )

                let channelReports = interaction.client.channels.cache.get("1160764565240430644")
                return channelReports.send({embeds: [embed]})
            } else {
                return interaction.reply({content: "Review ID could not be found..", ephemeral: true})
            }
        }
    }
}