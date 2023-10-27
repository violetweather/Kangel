const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const { VoteClient, VoteClientEvents } = require("topgg-votes");
const votesClient = new VoteClient({
    token: process.env.TOPGG_TOKEN
})

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote on Top.gg for rewards!'),
    async execute(interaction) {
        let data = accountSchema.findOne({User: interaction.user.id}).catch(err => {})

        votesClient.hasVoted(interaction.user.id).then(voted => {
            let embed = new EmbedBuilder()
            if (voted) {
                if(data) {
                    embed.setDescription("**You've voted today!** \n Reward: x2<:8187:1163707516417486879> x35<:coins:1163712428975079456>!")
                } else {
                    embed.setDescription("You're missing out on possible Kangel account rewards! `/kangel create` to make an account now!")
                }
                embed.setTitle("Thanks for voting for Kangel on Top.gg!")
                embed.setFooter({text: "If you're enjoying Kangel, please consider leaving a review on Top.gg!"})
                embed.setColor("DarkVividPink")
                embed.setURL("https://top.gg/bot/1140470772108906630#reviews")
                return interaction.reply({embeds:[embed]})
            }
        
            if (!voted) {
                if(data) {
                    embed.setDescription("**Vote Reward: x2<:8187:1163707516417486879> x35<:coins:1163712428975079456>!**")
                } else {
                    embed.setDescription("You're missing out on possible Kangel account rewards! `/kangel create` to make an account now!")
                }
                embed.setTitle("You have not voted for Kangel! Click here to vote.")
                embed.setFooter({text: "If you're enjoying Kangel, please consider leaving a review on Top.gg!"})
                embed.setColor("DarkVividPink")
                embed.setURL("https://top.gg/bot/1140470772108906630")
                return interaction.reply({embeds:[embed]})
            }
        })
    }
}