const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const { stressMin, stressMax } = require("../../utilities/stressStat.json")
const { affectionMin, affectionMax } = require("../../utilities/affectionStat.json")
const { mentalMin, mentalMax } = require("../../utilities/mentalStat.json")
const checkDailies = require("../../utilities/checkDailies")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('internet')
		.setDescription('Search the Internet with Kangel!')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Select where to go on the internets')
                .setRequired(true)
                .addChoices(
                    {name: '/st/', value: 'st'},
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
                case "st": {
                    let embed = new EmbedBuilder()
                    .setImage("https://i.imgur.com/kiD9aci.png")
                    .setColor("LuminousVividPink")
        
                    try {
                        await accountSchema.findOneAndUpdate(
                            {Guild: interaction.guild.id, User: interaction.user.id},
                            {
                                $inc: {
                                    DailyActivityCount: -1,
                                    StressStat: +randomStress*1.9,
                                    MentalDarknessStat: +randomMental*0.8
                                }
                            }
                        )
                    } catch(err) {
                        console.log(err);
                    }
        
                    embed.addFields(
                        { name: `/st/`,
                            value: [
                                `Kangel's stress went up by **${randomStress*1.9.toFixed(2)}**!`,
                                `Kangel's mental darkness went up by **${randomMental*0.8.toFixed(2)}**!`
                            ].join("\n"),
                            inline: true
                        },
                    )

                    return interaction.reply({embeds: [embed]})
                }
                break;
            }
        } else {
            return interaction.reply("You need to make Kangel a streaming account first!")
        }
    }
}