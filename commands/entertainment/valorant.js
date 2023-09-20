const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { API } = require('vandal.js');
const moment = require('moment')

module.exports = {
    category: "entertainment",
	data: new SlashCommandBuilder()
		.setName('valorant')
		.setDescription('Get the valorant stats for a public tracker.gg account')
		.addStringOption(option =>
			option.setName('user')
				.setDescription('The Riot username of the player.')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('The Riot tag of the player.')
                .setRequired(true))
                .addStringOption(option =>
                    option.setName('category')
                        .setDescription('Which stats would you like to get from the player?')
                        .setRequired(true)
                        .addChoices(
                            {name: 'Ranked', value: 'val_comp'},
                            {name: 'Unranked', value: 'val_casual'}
                        )),
	async execute(interaction) {
        const category = interaction.options.getString('category');
        const riotUser = interaction.options.getString('user', true);
        const riotTag = interaction.options.getString('tag', true);
        const riot = await API.fetchUser(riotUser, riotTag)
        
        let playerInfo = riot.info()
        let rankedStats = riot.ranked()
        let casualStats = riot.unrated()

        let embed = new EmbedBuilder()
        .setAuthor({ name: `${playerInfo.name}`, iconURL: `${playerInfo.avatar}`})
        .setColor("Random")
        .addFields(
            { name: 'Current Rank', value: `${playerInfo.rank}`},
            { name: 'Peak Rank', value: `${playerInfo.peakRank}`}
        );

        if(category === "val_comp") {
            if(!rankedStats.matchesPlayed) {
                return interaction.reply({content: "Player has not queued competitive as of this episode.", ephemeral: true})
            }

            embed.setTitle("Competitive Stats")
            embed.addFields(
                { name: "Matches Played", value: `${rankedStats.matchesPlayed}`, inline: true},
                { name: "Matches Won", value: `${rankedStats.matchesWon}`, inline: true},
                { name: "Matches Tied", value: `${rankedStats.matchesTied}`, inline: true},
                { name: "Win %", value: `${rankedStats.matchesWinPct.toFixed(1)}%`, inline: true},
                // { name: "Playtime", value: `${moment.utc(rankedStats.timePlayed*1000).format('HH:MM')}`, inline: true},
                { name: "Damage/Round", value: `${rankedStats.damagePerRound.toFixed(1)}`, inline: true},
                { name: "Kills", value: `${rankedStats.kills.toLocaleString()}`, inline: true},
                { name: "Deaths", value: `${rankedStats.deaths.toLocaleString()}`, inline: true},
                { name: "Assists", value: `${rankedStats.assists.toLocaleString()}`, inline: true},
                { name: "K/D Ratio", value: `${rankedStats.kDRatio.toFixed(1)}`, inline: true},
                { name: "Headshot %", value: `${rankedStats.headshotsPercentage.toFixed(1)}%`, inline: true},
                { name: "ACS", value: `${rankedStats.scorePerRound.toFixed(1)}`, inline: true},
            )

            await interaction.reply({embeds: [embed]});
        }

        if(category === "val_casual") {
            embed.setTitle("Unrated Stats")
            if(!casualStats.matchesPlayed) {
                return interaction.reply({content: "Player has not queued unrated as of this episode.", ephemeral: true})
            }
            embed.addFields(
                { name: "Matches Played", value: `${casualStats.matchesPlayed}`, inline: true},
                { name: "Matches Won", value: `${casualStats.matchesWon}`, inline: true},
                { name: "Matches Tied", value: `${casualStats.matchesTied}`, inline: true},
                { name: "Win %", value: `${casualStats.matchesWinPct.toFixed(1)}%`, inline: true},
                // { name: "Playtime", value: `${moment.utc(casualStats.timePlayed).format('HH[h]:mm[m]')}`, inline: true},
                { name: "Damage/Round", value: `${casualStats.damagePerRound.toFixed(1)}`, inline: true},
                { name: "Kills", value: `${casualStats.kills.toLocaleString()}`, inline: true},
                { name: "Deaths", value: `${casualStats.deaths.toLocaleString()}`, inline: true},
                { name: "Assists", value: `${casualStats.assists.toLocaleString()}`, inline: true},
                { name: "K/D Ratio", value: `${casualStats.kDRatio.toFixed(1)}`, inline: true},
                { name: "Headshot %", value: `${casualStats.headshotsPercentage.toFixed(1)}%`, inline: true},
                { name: "ACS", value: `${casualStats.scorePerRound.toFixed(1)}`, inline: true},
            )

            await interaction.reply({embeds: [embed]});
        }
    }
}