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
            try {
                const [translation] = await translate.translate(input, langMatch[0].code);
                return translation;
            } catch(err) {
                return interaction.reply({ content: "There was an error translating your message.", ephemeral: true})
            }
        }
        
        let translateFunction = await newTranslate()

        let embed = new EmbedBuilder()
        .setColor('Blue')
        .addFields(
            { name: `🌐 Translate command prompt`,
                value: [
                    `**From**: ${input}`,
                    `**To**: ${decodeURIComponent(translateFunction)}`,
                ].join("\n"),
            },
        )

        await interaction.reply({embeds: [embed]})
    }
}