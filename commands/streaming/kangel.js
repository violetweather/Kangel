
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
                {name: 'data', value: 'acc_info'},
                {name: "end", value: 'acc_del'},
                {name: "claim", value: "acc_claim"},
                {name: "vault", value: 'acc_vault'}
            ).setRequired(true)),
	async execute(interaction) {
        const nf = new Intl.NumberFormat('en-US');
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
                    Crystal: 10,
                    StressStat: 10,
                    AffectionStat: 10,
                    MentalDarknessStat: 10,
                    DailyActivityCount: 10,
                    LastActivity: Date.now()
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
                            `***She starts out with 10 Angel Crystal! Use these with caution.***`,
                            `**You have 10 action points per day!**`,
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
					{ name: `<:heart:1155448985956397078> Kangel Save Data`,
						value: [
							`**👤 Followers**: ${data.Followers}`,
                            `\n **<:8187:1163707516417486879> Angel Crystals**: ${data.Crystal}`,
							`**<:coins:1163712428975079456> Angel Coins **: ${data.Wallet}`,
                            `**🏦 Angel Bank**: ${data.Bank}`,
                            `\n **📅 Remaining Daily Points**: ${data.DailyActivityCount} \n`,
                            `**😞 Stress**: ${nf.format(data.StressStat)}`,
							`**💗 Affection**: ${nf.format(data.AffectionStat)}`,
                            `**😵‍💫 Mental Darkness**: ${nf.format(data.MentalDarknessStat)}`
						].join("\n"),
                        inline: true,
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
            case "acc_claim": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})

                if(data.DailyActivityCount > 0) {
                    return claimDailies(interaction, interaction.guild.id, interaction.user.id);
                } else if (data.DailyActivityCount === 0) {
                    return claimDailies(interaction, interaction.guild.id, interaction.user.id);
                }
            }
            break;
            case "acc_vault": {
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})
                if(data.Items.length === 0) return interaction.reply({content: "No items or characters found in your account!", ephemeral: true})

                const capitalise = (str) => str.replace(/\b[a-z]/g, (c) => c.toUpperCase());
                
                const counts = data.Items
                  .toSorted((a, b) => b.ItemID - a.ItemID) // sort by ID highest to lowest
                  .reduce((acc, { ItemID, ItemName, ItemRarityStandard }) => {
                    acc[ItemID] ??= {
                        ItemName,
                        ItemRarityStandard,
                        count: 0,
                    };
                    acc[ItemID].count++;
                    return acc;
                }, {});
                
                const str = Object.values(counts)
                .map(({ ItemName, ItemRarityStandard, count }) => `${count}x ${capitalise(ItemName)} **${ItemRarityStandard}**`)
                .join("\n");

                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTitle("Amount owned | Name | Rarity")
                .setDescription(str)

                interaction.reply({embeds:[embed]})
            }
        }
    }
}