const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const parseMs = require("parse-ms-2")
const { dailyMin, dailyMax } = require("../../utilities/daily.json")
const { stressMin, stressMax } = require("../../utilities/stressStat.json")
const { affectionMin, affectionMax } = require("../../utilities/affectionStat.json")
const { mentalMin, mentalMax } = require("../../utilities/mentalStat.json")
const streamComments = require("../../utilities/streamComments.json")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('stream')
		.setDescription('Make Kangel stream once a day!')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Set a topic for your stream!')
                .setRequired(true)
                .addChoices(
                    {name: '🍿 Entertainment', value: 'entertain'},
                    {name: '❤️ Chill', value: 'chill'},
                    {name: '👻 Scary', value: 'scary'}
        )),
	async execute(interaction) {
        const values = Object.values(streamComments)
        const randomValue = values[parseInt(Math.random() * values.length)]

        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id}).catch(err => {})

        if(data) {
            const cooldown = 86400000;
            const timeLeft = cooldown - (Date.now() - data.LastDaily);
            let activityCooldown = 86400000;
            let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);
    
            if(timeLeft > 0) {
                const { hours, minutes, seconds } = parseMs(timeLeft);
                return interaction.reply({content: `Streaming is tiring.. come back in ${hours} hours ${minutes} minutes ${seconds} seconds`, ephemeral: true});
            }

            if(data.DailyActivityCount === 0) {
                if(activityTimeLeft === 0) {     
                    try {
                        await accountSchema.findOneAndUpdate(
                            {Guild: interaction.guild.id, User: interaction.user.id},
                            {
                                $inc: {
                                    DailyActivityCount: +3,
                                }
                            }
                        )
                    } catch(err) {
                        console.log(err);
                    }
                } else {
                    return interaction.reply({content: `You've exhausted your daily activities with Kangel!`, ephemeral: true})
                }
            }

            if(data.DailyActivityCount === 1) {
                try {
                    await accountSchema.findOneAndUpdate(
                        {Guild: interaction.guild.id, User: interaction.user.id},
                        {
                            $set: {
                                LastActivity: Date.now(),
                            }
                        }
                    )
                } catch(err) {
                    console.log(err);
                }
            }
    
            const randomFollower = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);
            let randomAmount = randomFollower*4

            const randomStress = Math.floor(Math.random() * (stressMax - stressMin + 1) + stressMin);
            const randomMental = Math.floor(Math.random() * (mentalMax - mentalMin + 1) + mentalMin);
            const randomAffection = Math.floor(Math.random() * (affectionMax - affectionMin + 1) + affectionMin);
            
            async function dailyStreamDB(stressTimes, affectionTimes, mentalTimes, followerTimes, walletTimes) {
                try {
                    await accountSchema.findOneAndUpdate(
                        {Guild: interaction.guild.id, User: interaction.user.id},
                        {
                            $set: {
                                LastDaily: Date.now(),
                            },
                            $inc: {
                                Followers: randomFollower*followerTimes.toFixed(0),
                                Wallet: randomAmount*walletTimes.toFixed(0),
                                DailyActivityCount: -1,
                                StressStat: randomStress*stressTimes,
                                MentalDarknessStat: randomMental*mentalTimes,
                                AffectionStat: -randomAffection*affectionTimes,
                            }
                        }
                    )
                } catch(err) {
                    console.log(err);
                }
            }

            const embed = new EmbedBuilder()
            .setImage(`${randomValue}`)
            .setColor("LuminousVividPink")

            if(interaction.options.getString('topic') === "entertain") {
                dailyStreamDB(1.2, 0.3, 1.1, 1.1, 1.1)
                embed.setTitle("🍿 Entertainment Stream!")
                embed.addFields(
                    { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                        value: [
                            `Kangel gained **${randomFollower*1.1.toFixed(0)} new followers**!`,
                            `Kangel earned **¢${randomAmount*1.1.toFixed(0)} in Ad Revenue**!`,
                            `Kangel's stress went up by **${randomStress*1.2.toFixed(2)}**!`,
                            `Kangel's affection went down by **${randomAffection*0.3.toFixed(2)}**!`,
                            `Kangel's mental darkness went up by **${randomMental*1.1.toFixed(2)}**!`
                        ].join("\n"),
                        inline: true
                    },
                )

                return interaction.reply({embeds: [embed]})
            }

            if(interaction.options.getString('topic') === "chill") {
                dailyStreamDB(1, 0.1, 1.2, 1, 1)
                embed.setTitle("❤️ Chill Stream!")
                embed.addFields(
                    { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                        value: [
                            `Kangel gained **${randomFollower*1.00.toFixed(0)} new followers**!`,
                            `Kangel earned **¢${randomAmount*1.00.toFixed(0)} in Ad Revenue**!`,
                            `Kangel's stress went up by **${randomStress*1.00.toFixed(2)}**!`,
                            `Kangel's affection went down by **${randomAffection*0.1.toFixed(2)}**!`,
                            `Kangel's mental darkness went up by **${randomMental*1.2.toFixed(2)}**!`
                        ].join("\n"),
                        inline: true
                    },
                )

                return interaction.reply({embeds: [embed]})
            }

            if(interaction.options.getString('topic') === "scary") {
                dailyStreamDB(1.4, 0.6, 1.1, 1.4, 1.2)
                embed.setTitle("👻 Scary Stream!")
                embed.addFields(
                    { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                        value: [
                            `Kangel gained **${randomFollower*1.4.toFixed(0)} new followers**!`,
                            `Kangel earned **¢${randomAmount*1.2.toFixed(0)} in Ad Revenue**!`,
                            `Kangel's stress went up by **${randomStress*1.4.toFixed(1)}**!`,
                            `Kangel's affection went down by **${randomAffection*0.6.toFixed(2)}**!`,
                            `Kangel's mental darkness went up by **${randomMental*1.1.toFixed(2)}**!`
                        ].join("\n"),
                        inline: true
                    },
                )

                return interaction.reply({embeds: [embed]})
            }
        } else {
            return interaction.reply("You need to make Kangel a streaming account first!")
        }
    }
}