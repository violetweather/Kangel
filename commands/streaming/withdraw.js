const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account");

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('withdraw')
		.setDescription('Withdraw angel coins from your bank account')
        .setDMPermission(false)
        .addStringOption(option => 
                option.setName('amount')
                .setDescription('Enter your withdraw amount').setRequired(true)),
	async execute(interaction) {
        const { options, user, guild } = interaction;

        const value = options.getString("amount")

        let data = await accountSchema.findOne({ Guild: interaction.guild.id, User: user.id}).catch(err => { })
        if(!data) return interaction.reply({content: "You haven't set Kangel a streamer account, yet.", ephemeral: true})

        if(value.toLowerCase() === "all") {
            if(data.Bank === 0) return interaction.reply({content: "Your bank is emptier than my heart.", ephemeral: true})

            data.Wallet += data.Bank
            data.Bank = 0

            await data.save()

            return interaction.reply({content: "You've given all your money to Kangel.. **be careful**"})
        } else {
            const converted = Number(value)

            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
            if(data.Bank < parseInt(converted) || converted === Infinity) return interaction.reply({content: "You don't have money in your bank, should probably put some in it!", ephemeral: true})

            data.Wallet += parseInt(converted)
            data.Bank -= parseInt(converted)
            data.Bank = Math.abs(data.Bank)

            await data.save()

            const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`${parseInt(converted)}¢ was withdrawn from your bank, don't forget about Kangel's bills..`)

            return interaction.reply({embeds: [embed]})
        }
    }
}