const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const parseMs = require("parse-ms-2")
const { stressMin, stressMax } = require("../../utilities/stressStat.json")
const { affectionMin, affectionMax } = require("../../utilities/affectionStat.json")
const { mentalMin, mentalMax } = require("../../utilities/mentalStat.json")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('sex')
		.setDescription('Have sex with Kangel.')
        .setDMPermission(false),
	async execute(interaction) {
        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id}).catch(err => {})
        const randomStress = Math.floor(Math.random() * (stressMax - stressMin + 1) + stressMin);
        const randomMental = Math.floor(Math.random() * (mentalMax - mentalMin + 1) + mentalMin);
        const randomAffection = Math.floor(Math.random() * (affectionMax - affectionMin + 1) + affectionMin);

        if(data) {
            let activityCooldown = 86400000;
            let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);

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

            let embed = new EmbedBuilder()
            .setImage(`https://media.tenor.com/cqja9fAbYgUAAAAd/needy-girl-overdose-sex.gif`)
            .setColor("LuminousVividPink")

            try {
                await accountSchema.findOneAndUpdate(
                    {Guild: interaction.guild.id, User: interaction.user.id},
                    {
                        $inc: {
                            DailyActivityCount: -1,
                            StressStat: -randomStress*0.5,
                            MentalDarknessStat: randomMental*1.3,
                            AffectionStat: randomAffection*1.1,
                        }
                    }
                )
            } catch(err) {
                console.log(err);
            }

            embed.addFields(
                { name: `<:heart:1155448985956397078>`,
                    value: [
                        `Kangel's stress went down by **${randomStress*0.5.toFixed(2)}**!`,
                        `Kangel's affection went up by **${randomAffection*1.1.toFixed(2)}**!`,
                        `Kangel's mental darkness went up by **${randomMental*1.3.toFixed(2)}**!`
                    ].join("\n"),
                    inline: true
                },
            )

            return interaction.reply({embeds: [embed]})
        } else {
            return interaction.reply("You need to make Kangel a streaming account first!")
        }
    }
}