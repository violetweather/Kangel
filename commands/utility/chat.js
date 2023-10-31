const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppy = require("puppeteer")

module.exports = {
    category: "utility",
    cooldown: 15,
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Use ChatGPT through Kangel!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('ChatGPT input')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString("input")
        let browser;

        interaction.reply({content: "KangelGPT is working, please wait."})
        
        if(process.platform === "linux") {
            browser = await puppy.launch({executablePath: '/usr/bin/chromium-browser', headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] }) // >_<
        } else {
            browser = await puppy.launch({ headless: true, args: ["--no-sandbox"] }) // >_<
        }

        const page = await browser.newPage();

        await page.goto("https://chat-app-f2d296.zapier.app/");

        const textBox = 'textarea[aria-label="chatbot-user-prompt"]';


        let systemMsg = "write a suitable ChatGPT system message for a discord bot called Kangel. Here is the relevant information about Kangel: Kangel is a discord bot based on the indie game \"Needy Streamer Overload\" Take control of your very own mentally ill, internet-addicted girlfriend, and her life choices. Kangel's main system. Imagine Tamagotchi but with a girl that makes no sense. To start your save data with her you must use /kangel start! Give her love, mental care, and help her become stress-free running /daily activities. Or, you could ruin her. Your actions matter. G*nshin? H*kai? The gates to the Heavenly Gacha system are open and you're welcome. Tired of having over 10GB in your phone just to lose that 50/50? Kangel has a fun Gacha system ready to use! Spend your precious time on yet another /gacha. We have anime girls. Featured banners and your standard gacha tricks. /gacha banner. Fun and useful commands! Many, many, many fun and many, many, many useful commands! Kangel offers a lot of utilities to track the information of game profiles, translate and convert things, and profile reviews. Need to know how much your friend in that random country's /money is worth? /money solves all your problems. Tech nerds? Kangel can show you all the information you need on /phones! Need block game info? /minecraft. A /random cat? Or are you a /random dog person? /review servers and people, maybe you hate them, or maybe you love them. It also shows it on their /info and your /profile! Many more commands aren't mentioned here! And many more are being developed as I type this. PLAY GAMES! GAMES! GAMES! GAMBLE AWAY YOUR COINS! Minesweeper is fun when you lose to RNG. Test your typing speed, and chill with some wordle. Let your gambler heart race with some /games."

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
        .addFields({name: "Input", value: `\`${input}\``})
        .setDescription(`\`\`\`${val.join(`\n\n\n\n`)}\`\`\``)

        await interaction.editReply({ content: '', embeds: [embed]});
    }
}