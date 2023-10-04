const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Deposit angel coins to your bank account')
        .setDMPermission(false)
        .addStringOption(option => 
                option.setName('amount')
                .setDescription('Enter your deposit amount').setRequired(true)),
	async execute(interaction) {
        const { options, user, guild } = interaction;

        const value = options.getString("amount")

        let data = await accountSchema.findOne({ Guild: interaction.guild.id, User: user.id}).catch(err => { })
        if(!data) return interaction.reply({content: "Kangel doesn't have a streamer account.", ephemeral: true})

        if(value.toLowerCase() === "all") {
            if(data.Wallet === 0) return interaction.reply({content: "Kangel is broke. No money to deposit.", ephemeral: true})

            data.Bank += data.Wallet
            data.Wallet = 0

            await data.save()

            return interaction.reply({content: "You've secured all of Kangel's money away, I am proud."})
        } else {
            const converted = Number(value)

            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
            if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})
            if(value < 0) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})

            data.Bank += parseInt(converted)
            data.Wallet -= parseInt(converted)
            data.Wallet = Math.abs(data.Wallet)

            await data.save()

            const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`${parseInt(converted)}¢ was deposited into your bank!`)

            return interaction.reply({embeds: [embed]})
        }
    }
}