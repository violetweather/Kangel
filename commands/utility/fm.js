const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');
const lastfm = require("lastfm-njs")

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('fm')
		.setDescription('Last.fm command, search up music, and your account stats!')
        .addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Info about a lastfm user')
				.addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true))),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('chart')
        //         .setDescription('Get weekly artist chart')
        //         .addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true)))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('top')
        //         .setDescription('Get top tracks for user')
        //         .addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true))),
    async execute(interaction) {
        let userInput = interaction.options.getString("target")
        const nf = new Intl.NumberFormat('en-US');

        var lfm = new lastfm.default({
            apiKey: process.env.LASTFM_KEY,
            apiSecret: process.env.LASTFM_SECRET,
            username: "violetweather"
        })

        if(interaction.options.getSubcommand() === "info") {
            try {
                let infoParams = {
                    user: userInput,
                }

                let recentTracksParams = {
                    user: userInput,
                    limit: 5
                }

                let userInfo = await lfm.user_getInfo(infoParams)
                let userRecent = await lfm.user_getRecentTracks(recentTracksParams)
    
                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTitle(`${userInfo.name}'s lastfm user profile.`)
                .setURL(userInfo.url)
                .setThumbnail(userInfo.image[1]["#text"])
                .addFields(
                    { name: `General Information`,
                        value: [
                            `**🎵 Tracks Scrobbled**: ${nf.format(userInfo.playcount)}`,
                            `**👤 Unique Artists**: ${nf.format(userInfo.artist_count)}`,
                            `**🎼 Unique Tracks**: ${nf.format(userInfo.track_count)}`,
                            `**📻 Unique Albums**: ${nf.format(userInfo.album_count)}`
                        ].join("\n"),
                        inline: true
                    },
                )

                if(userRecent) {
                    let lastListen = userRecent.track[0] || "N/A"
                    embed.addFields(
                        { name: `Last Played`,
                            value: [
                                `**🎶 Song Title**: [${lastListen.name}](${lastListen.url})`,
                                `**👤 Song Artist**: ${lastListen.artist["#text"]}`,
                                `**📻 Song Album**: ${lastListen.album["#text"]}`
                            ].join("\n"),
                        },
                    )
                    embed.setImage(lastListen.image[2]["#text"])
                }

                return interaction.reply({embeds:[embed]});
            } catch(err) {
                interaction.reply({content: "There was an error while trying to find the user's information.", ephemeral: true})
                return console.log(err);
            }
        }

        // if(interaction.options.getSubcommand() === "chart") {
        //     try {
        //         let weeklyArtistChartParms = {
        //             user: userInput
        //         }

        //         let weeklyArtistChart = await lfm.user_getWeeklyArtistChart(weeklyArtistChartParms)

        //         let artistChart = [];
        //         await weeklyArtistChart.artist.forEach(async a => {
        //             artistChart.push(`**Artist Name**: [${a.name}](${a.url}) \n **Scrobbles**: ${a.playcount}`)
        //         });

        //         let embed = new EmbedBuilder()
        //         .setColor("LuminousVividPink")
        //         .setDescription(artistChart.join('\n \n').slice(0, 2000))

        //         interaction.reply({embeds:[embed]})
        //     } catch(err) {
        //         interaction.reply({content: "There was an error while trying to find the user's information.", ephemeral: true})
        //         return console.log(err);
        //     }
        // }


    }
}