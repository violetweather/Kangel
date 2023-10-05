const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const parseMs = require("parse-ms-2")
const { stressMin, stressMax } = require("../../utilities/stressStat.json")
const { affectionMin, affectionMax } = require("../../utilities/affectionStat.json")
const { mentalMin, mentalMax } = require("../../utilities/mentalStat.json")
const checkDailies = require("../../utilities/checkDailies")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('drugs')
		.setDescription('Let Kangel have a certain something.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Select a certain something')
                .setRequired(true)
                .addChoices(
                    {name: '🚬🌈 Magic Smoke', value: 'magic_smoke'},
                    {name: '💊 Dyslem', value: `dyslem`}
        )),
	async execute(interaction) {
        const { options, user, guild } = interaction;
        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id}).catch(err => {})
        const randomStress = Math.floor(Math.random() * (stressMax - stressMin + 1) + stressMin);
        const randomMental = Math.floor(Math.random() * (mentalMax - mentalMin + 1) + mentalMin);

        if(data) {
            if(data.DailyActivityCount > 0) {
                checkDailies(interaction, interaction.guild.id, interaction.user.id)
            } else if (data.DailyActivityCount === 0) {
                return checkDailies(interaction, interaction.guild.id, interaction.user.id)
            }

            switch(options.getString("options")) {
                case "magic_smoke": {
                    let embed = new EmbedBuilder()
                    .setImage(`https://media.tenor.com/Cg2xFB_tvX8AAAAd/needy-streamer-overload.gif`)
                    .setColor("LuminousVividPink")
        
                    try {
                        await accountSchema.findOneAndUpdate(
                            {Guild: interaction.guild.id, User: interaction.user.id},
                            {
                                $inc: {
                                    DailyActivityCount: -1,
                                    StressStat: -randomStress*1.5,
                                    MentalDarknessStat: +randomMental*0.6
                                }
                            }
                        )
                    } catch(err) {
                        console.log(err);
                    }
        
                    embed.addFields(
                        { name: `<:heart:1155448985956397078> Magic Smoke!`,
                            value: [
                                `Kangel's stress went down by **${randomStress*1.5.toFixed(2)}**!`,
                                `Kangel's mental darkness went up by **${randomMental*0.6.toFixed(2)}**!`
                            ].join("\n"),
                            inline: true
                        },
                    )
        
                    return interaction.reply({embeds: [embed]})
                }
                break;
                case "dyslem": {
                    let embed = new EmbedBuilder()
                    .setImage(`https://media.tenor.com/c5oQLAH0MQ8AAAAC/medication-tablet-medicine.gif`)
                    .setColor("LuminousVividPink")
        
                    try {
                        await accountSchema.findOneAndUpdate(
                            {Guild: interaction.guild.id, User: interaction.user.id},
                            {
                                $inc: {
                                    DailyActivityCount: -1,
                                    StressStat: -randomStress*1.2,
                                    MentalDarknessStat: +randomMental*0.5
                                }
                            }
                        )
                    } catch(err) {
                        console.log(err);
                    }
        
                    embed.addFields(
                        { name: `<:heart:1155448985956397078> Dylsem!`,
                            value: [
                                `Kangel's stress went down by **${randomStress*1.2.toFixed(2)}**!`,
                                `Kangel's mental darkness went up by **${randomMental*0.5.toFixed(2)}**!`
                            ].join("\n"),
                            inline: true
                        },
                    )
        
                    return interaction.reply({embeds: [embed]})
                }
            }
        } else {
            return interaction.reply("You need to make Kangel a streaming account first!")
        }
    }
}