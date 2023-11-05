const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');
const lastfm = require("lastfm-njs")
const axios = require('axios');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('fm')
		.setDescription('Last.fm command, search up music, and your account stats!')
        .addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Info about a lastfm user')
				.addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('np')
                .setDescription('Now playing on your lastfm!')
                .addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('top')
                .setDescription('Get top tracks for user')
                .addStringOption(option => option.setName('target').setDescription('The target user').setRequired(true))),
    async execute(interaction) {
        let userInput = interaction.options.getString("target")
        const nf = new Intl.NumberFormat('en-US');

        var lfm = new lastfm.default({
            apiKey: process.env.LASTFM_KEY,
            apiSecret: process.env.LASTFM_SECRET,
            username: "violetweather"
        })

        function killHTML(str) {
            if ((str===null) || (str===''))
                return false;
            else
            str = str.toString();
            return str.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, ' ');
        }

        if(interaction.options.getSubcommand() === "info") {
            try {
                let infoParams = {
                    user: userInput,
                }

                let userInfo = await lfm.user_getInfo(infoParams)
    
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

                return interaction.reply({embeds:[embed]});
            } catch(err) {
                interaction.reply({content: "There was an error while trying to find the user's information.", ephemeral: true})
                return console.log(err);
            }
        }

        if(interaction.options.getSubcommand() === "np") {
            try {
                let recentTracksParams = {
                    user: userInput,
                    limit: 5
                }

                let infoParams = {
                    user: userInput,
                }

                let userInfo = await lfm.user_getInfo(infoParams)
    
                let userRecent = await lfm.user_getRecentTracks(recentTracksParams)

                if(userRecent) {
                    let embed = new EmbedBuilder()
                    .setTitle(`${userInfo.name}'s lastfm user profile.`)
                    .setURL(userInfo.url)
                    .setColor("DarkVividPink")
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
                    return interaction.reply({embeds:[embed]});
                }
            } catch(err) {
                interaction.reply({content: "There was an error while trying to find the user's information.", ephemeral: true})
                return console.log(err);
            }
        }

        if(interaction.options.getSubcommand() === "top") {
            try {
                let artists = [];
                let embeds = [];

                for (let i = 0; i <= 4; i++) { 
                    let weeklyArtistChartParms = {
                        user: userInput
                    }
    
                    let weeklyArtistChart = await lfm.user_getWeeklyArtistChart(weeklyArtistChartParms)
                    let wa = await weeklyArtistChart.artist[i]

                    let artistMoreInfoParms = {
                        mbid: wa.mbid
                    }

                    let artistInfo = await lfm.artist_getInfo(artistMoreInfoParms)

                    let embed = new EmbedBuilder()
                    .setColor("LuminousVividPink")

                    .addFields(
                        { name: `User stats`,
                            value: [
                                `**👤 [${wa.name}](${wa.url})**`,
                                `🎶 ${nf.format(wa.playcount)} scrobbles`,
                            ].join("\n"),
                        },
                    )

                    if(artistInfo.bio) {
                        embed.setDescription(killHTML(artistInfo.bio.summary))
                    }

                    if(artistInfo.image) {
                        embed.setImage(artistInfo.image[2]["#text"])
                    }

                    if(artistInfo.stats) {
                        embed.addFields(
                            { name: `Site-wide stats`,
                                value: [
                                    `👤 ${nf.format(artistInfo.stats.listeners)} listeners`,
                                    `🎶 ${nf.format(artistInfo.stats.playcount)} scrobbles`,
                                ].join("\n"),
                            },
                        )
                    }
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
            } catch(err) {
                interaction.reply({content: "There was an error while trying to find the user's information.", ephemeral: true})
                return console.log(err);
            }
        }
    }
}