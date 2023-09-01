const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const axios = require('axios')
const langsFile = require('../../utilities/languages')

module.exports = {
    cooldown: 5,
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translate anything you would like.')
        .addStringOption(option => 
            option.setName('to')
            .setDescription('The language the text must be translated to.')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('input')
            .setDescription('Your translation input.')
            .setRequired(true)),
    async execute(interaction) {
        const toLang = interaction.options.getString('to', true);
        const input = interaction.options.getString('input', true);
        let langMatch = langsFile.filter(
            function(l) { 
                return l.language.toUpperCase() === toLang.toUpperCase()
            }
        )

        const requestData = {
            text: input,
            target_lang: langMatch[0].code,
        };

        const response = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            requestData,
            {
                headers: {
                    Authorization: `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        let translation = decodeURIComponent(response.data.translations[0].text);
        let sourceLang = langsFile.filter(function(l) { return l.code === response.data.translations[0].detected_source_language})
        console.log(response.data.translations[0].detected_source_language)

        if(translation) {
            let embed = new EmbedBuilder()
            .setTitle(`Translation from ${sourceLang[0].language} to ${langMatch[0].language}`)
            .setColor("Blue")
            .setDescription(translation)

            await interaction.reply({embeds: [embed]})
        } else {
            await interaction.reply({content: "API Error: Rate limited", ephemeral: true})
        }
    }
}