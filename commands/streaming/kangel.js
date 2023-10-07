
const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const claimDailies = require("../../utilities/claimDailies")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('kangel')
		.setDescription('Start your journey to make Kangel an INTERNET ANGEL')
        .setDMPermission(false)
        .addStringOption(option => 
                option.setName('options')
                .setDescription('Select an option for Kangel\'s stream account')
                .addChoices(
                    {name: 'start', value: 'acc_create'},
                    {name: 'info', value: 'acc_info'},
                    {name: "end", value: 'acc_del'},
                    {name: "stats", value: 'acc_stats'},
                    {name: "claim", value: "acc_claim"}
                ).setRequired(true)),
	async execute(interaction) {
        const { options, user, guild } = interaction;

        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err => {})

        switch(options.getString("options")) {
            case "acc_create": {
                if (data) return interaction.reply({ content: "You've already created Kangel's streamer account", ephemeral: true})

                data = new accountSchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Followers: 1,
                    Wallet: 100,
                    Bank: 0,
                    StressStat: 10,
                    AffectionStat: 10,
                    MentalDarknessStat: 10,
                    DailyActivityCount: 3,
                })

                await data.save()
                
                let embed = new EmbedBuilder()
                .setTitle("🎉🎉🎉🎉🎉🎉🎉🎉🎉YOUVE MADE AN ACCOUNT FOR KANGEL!!!! 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉")
                .setColor("LuminousVividPink")
                .setImage("https://media.tenor.com/5n515t5xDVkAAAAd/needy-stream-overload-transfrom.gif")
                .addFields(
					{ name: `Help Kangel become an INTERNET ANGEL!!!! GET MANY FOLLOWERS AND MONEY.`,
						value: [
							`*You're her only follower right now.*`,
							`**You'll give her 100 coins to get through the beginning**`,
                            `**You have 3 actions per day!**`,
                            `->>> You are in control of Kangel, every choice you make will impact Kangel.`
						].join("\n"),
					},
				)

                await interaction.reply({embeds: [embed]})
            }
            break;
            case "acc_info": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})

                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `🎉 Kangel's streamer account:`,
						value: [
							`**Kangel's Followers**: ${data.Followers}`,
							`**Angel Coins (¢)**: ${data.Wallet}`,
                            `**Your Bank**: ${data.Bank}`,
                            `**Remaining Daily Actions**: ${data.DailyActivityCount}`,
						].join("\n"),
					},
				)

                await interaction.reply({embeds: [embed]})
            }
            break;
            case "acc_del": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account.", ephemeral: true})

                await data.deleteOne()

                await interaction.reply({ content: "Kangel's streamer account has been deleted."})
            }
            break;
            case "acc_stats": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})
                
                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `<:heart:1155448985956397078> My live stats`,
						value: [
							`**😞 Stress**: ${data.StressStat.toFixed(2)}`,
							`**💗 Affection**: ${data.AffectionStat.toFixed(2)}`,
                            `**😵‍💫 Mental Darkness**: ${data.MentalDarknessStat.toFixed(2)}`
						].join("\n"),
					},
				)

                await interaction.reply({embeds: [embed]})
            }
            break;
            case "acc_claim": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})

                if(data.DailyActivityCount > 0) {
                    return claimDailies(interaction, interaction.guild.id, interaction.user.id);
                } else if (data.DailyActivityCount === 0) {
                    return claimDailies(interaction, interaction.guild.id, interaction.user.id);
                }
            }
        }
    }
}