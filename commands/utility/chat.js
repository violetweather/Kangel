const cheerio = require("cheerio")
const axios = require("axios")
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppy = require("puppeteer")

module.exports = {
    category: "utility",
    cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Use ChatGPT through Kangel!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('ChatGPT input')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString("input")

        interaction.reply({content: "KangelGPT is working, please wait."})

        const browser = await puppy.launch({ headless: "new" }) // >_<
        const page = await browser.newPage();

        await page.goto("https://chat-app-f2d296.zapier.app/");

        const textBox = 'textarea[aria-label="chatbot-user-prompt"]';
        await page.waitForSelector(textBox);
        await page.type(textBox, input);

        await page.keyboard.press("Enter");

        await page.waitForSelector('[data-testid="final-bot-response"] p');

        var val = await page.$$eval('[data-testid="final-bot-response"]', async (elements) => {
            return elements.map((element) => element.textContent)
        });

        setTimeout(async () => {
            if(val.length == 0) return await interaction.editReply({content: "KangelGPT returned an error."});
        }, 30000);

        await browser.close();

        val.shift();
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`\`\`\`${val.join(`\n\n\n\n`)}\`\`\``)

        await interaction.editReply({ content: '', embeds: [embed]});
    }
}