const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const langsFile = require('../../utilities/languages')
const {Translate} = require('@google-cloud/translate').v2;
const credentialsJson = require('../../googleTranslate.json')

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
            .setMaxLength(950)
            .setRequired(true)),
    async execute(interaction) {
        const toLang = interaction.options.getString('to', true);
        const input = interaction.options.getString('input', true);
        const CREDENTIALS = credentialsJson
        let langMatch = langsFile.filter(
            function(l) { 
                return l.language.toUpperCase() === toLang.toUpperCase()
            }
        )

        const translate = new Translate({
            credentials: CREDENTIALS,
            projectId: CREDENTIALS.project_id
        });

        async function newTranslate() {
            const [translation] = await translate.translate(input, langMatch[0].code);
            return translation;
        }
        
        let translateFunction = await newTranslate()

        let embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`**From:** \n ${input} \n **To ${langMatch[0].language}:** \n ${decodeURIComponent(translateFunction)}`)

        await interaction.reply({embeds: [embed]})
    }
}