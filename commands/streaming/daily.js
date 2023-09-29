const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const parseMs = require("parse-ms-2")
const { dailyMin, dailyMax } = require("../../utilities/daily.json")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Make Kangel stream once a day!')
        .setDMPermission(false),
	async execute(interaction) {

        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id}).catch(err => {})

        if(data) {
            const cooldown = 86400000;
            const timeLeft = cooldown - (Date.now() - data.LastDaily);
    
            if(timeLeft > 0) {
                const { hours, minutes, seconds } = parseMs(timeLeft);
                return interaction.reply({content: `Streaming is tiring.. come back in ${hours} hours ${minutes} minutes ${seconds} seconds`, ephemeral: true});
            }
    
            const randomFollower = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);
            let randomAmount = randomFollower*4
     
            try {
                await accountSchema.findOneAndUpdate(
                    {Guild: interaction.guild.id, User: interaction.user.id},
                    {
                        $set: {
                            LastDaily: Date.now(),
                        },
                        $inc: {
                            Followers: randomFollower,
                            Wallet: randomAmount
                        }
                    }
                )
            } catch(err) {
                console.log(err);
            }

            const embed = new EmbedBuilder()
            .setImage("https://i.imgur.com/dRWpNGX.png")
            .setColor("LuminousVividPink")
            .addFields(
                { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                    value: [
                        `Kangel gained **${randomFollower} new followers**!`,
                        `Kangel earned **¢${randomAmount} in Ad Revenue**!`,
                    ].join("\n"),
                    inline: true
                },
            )

            await interaction.reply({embeds: [embed]})
        } else {
            return interaction.reply("You need to make Kangel a streaming account first!")
        }
    }
}