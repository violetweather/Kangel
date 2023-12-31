const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    category: "utility",
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('Convert money to other currencies')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The amount you want to convert')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('from')
				.setDescription('Original currency')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('to')
				.setDescription('The currency you want to convert to')
				.setRequired(true)),
    async execute(interaction) {
        const currencyFrom = interaction.options.getString('from');
        const currencyTo = interaction.options.getString('to');
        const currencyAmount = interaction.options.getString('amount');

        let currencyURL = `https://exchange-rates.abstractapi.com/v1/convert?api_key=${process.env.ABSTRACT_TOKEN}&base=${currencyFrom}&target=${currencyTo}&base_amount=${currencyAmount}`
        let currencyAPIRes = await axios.get(currencyURL)
            .catch(function (error) {
                if (error.response) {
                    return interaction.reply({content: `${error.response.data['error'].message}`, ephemeral: true});
                  } else if (error.request) {
                    return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                  } else {
                    return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                  }
            }
        )
        let currency = currencyAPIRes.data

        let embed = new EmbedBuilder()
        .setDescription(`Converted from **${currencyAmount.toLocaleString()} ${currencyFrom.toUpperCase()}** to **${currency.converted_amount.toLocaleString()} ${currencyTo.toUpperCase()}**`)
        .setColor('Green')

        await interaction.reply({embeds: [embed]})

    }
}