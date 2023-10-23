const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const Banner = require("../../Schemas.js/banners")
const gachaPull = require("../../utilities/gachaPullRate")
const parseMs = require("parse-ms-2")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('gacha')
		.setDescription('Play the Heavenly Angel game!')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Learn about the Heavenly gacha system.'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('banners')
                        .setDescription('Get information about the Heavenly Angel banners.'))
                        .addSubcommand(subcommand =>
                            subcommand
                                .setName('pull')
                                .setDescription('Pull for a banner in the Heavenly Gacha')
                                .addStringOption(option =>
                                    option.setName('banner')
                                        .setDescription('Which banner would you like to pull on?')
                                        .setRequired(true)
                                        .addChoices(
                                            {name: 'Featured', value: 'featured'}
                                ))
                                .addStringOption(option =>
                                    option.setName('choice')
                                        .setDescription('How many pulls?')
                                        .setRequired(true)
                                        .addChoices(
                                            {name: '1 Pull', value: 'one'},
                                            {name: '10 Pull', value: 'multi'}
                                )))
                                .addSubcommand(subcommand =>
                                    subcommand
                                        .setName('shop')
                                        .setDescription('Look at what is available on the shop!')
                                        .addStringOption(option =>
                                            option.setName('buy')
                                                .setDescription('Purchase an item by typing the ID here.'))
                                        .addStringOption(option =>
                                            option.setName('sell')
                                                .setDescription('Sell an item.'))),
    async execute(interaction) {
        const { options, user, guild } = interaction;
        let data = await accountSchema.findOne({User: user.id}).catch(err => {})

        switch(options.getSubcommand()) {
            case "info": {
                let embed = new EmbedBuilder()
                .setTitle("Welcome to the Heavenly Gacha")
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `You are able to pull for items and Kangel's favorite characters!`,
						value: [
							`Each gacha pull requires 10 Angel Crystal, with the option to pull 10 at a time at a discounted 80 Angel Crystals`,
                            `***She starts out with 10 Angel Crystal! Use these with caution.***`,
                            `Characters & Items have a 0-3 star rating, with the most valuable being at 3 star, and the least at 0 star.`
						].join("\n"),
					},
				)

                interaction.reply({embeds:[embed]})
            }
            break;
            case "banners": {
                let bannerData = await Banner.findOne({BannerName: "Featured"}).catch(err => {})

                if(!bannerData) {
                    try {
                        await Banner.create({
                            BannerName: "Featured",
                            BannerStarted: Date.now()
                        })
                    } catch(err) {
                        console.log(err)
                    }
                }

                let bannerCooldown = 1382400000;
                let bannerTimeLeft = bannerCooldown - (Date.now() - bannerData.BannerStarted);
                const { days, hours, minutes, seconds } = parseMs(bannerTimeLeft);

                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `**BETA** Featured 3★ Heavenly Gacha Banner`,
						value: [
                            `Banner is going away in **${days} days ${hours} hours and ${minutes} minutes.**\n`,
                            `Featured Characters: 3★ <:eris:1164023601368932382> Eris and 3★ <:skye:1164145689203318804> Skye! \n`,
							`Pull for a chance to get a 3★! \n - 1 pull = 10 <:8187:1163707516417486879> Angel Crystals | 10 pull = 80 <:8187:1163707516417486879> Angel Crystals [discount!])`,
                            `\n Characters & Items have a 0-3 star rating, with the most valuable being at 3 star, and the least at 0 star.`
						].join("\n"),
					},
				)

                interaction.reply({embeds:[embed]})
            }
            break;
            case "pull": {
                const selection = interaction.options.getString('banner');
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})
                if(data.Crystal === 0) return interaction.reply({content: "Kangel needs at least 10 <:8187:1163707516417486879> Angel Crystals to pull on banners.", ephemeral: true})
                if(data.Crystal < 10) return interaction.reply({content: "Kangel needs at least 10 <:8187:1163707516417486879> Angel Crystals to pull on banners.", ephemeral: true})
                const pullAmount = interaction.options.getString('choice');

                await gachaPull(interaction, selection, pullAmount)
            }
            break;
            case "shop": {
                let buyItemChoice = interaction.options.getString('buy')
                let sellItemChoice = interaction.options.getString('sell')

                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `**BETA** Heavenly Shop`,
						value: [
							`[ID:AC1] **1 <:8187:1163707516417486879> Angel Crystal** \n - Available now for 100 <:coins:1163712428975079456> Angel Coins`,
                            `[ID:AC10] **10 <:8187:1163707516417486879> Angel Crystals** \n - Available now for 1000 <:coins:1163712428975079456> Angel Coins`
						].join("\n"),
					},
				)
                .setFooter({text: "How to use: /gacha shop buy ID"})

                if(buyItemChoice) {
                    if(!data) return interaction.reply({content: "You haven't set Kangel a streamer account, yet.", ephemeral: true})
                    if(data.Wallet === 0) return interaction.reply({content: "You have no money to purchase anything..", ephemeral: true})
                    if(data.Wallet < 0) return interaction.reply({content: "You have no money to purchase anything..", ephemeral: true})

                    let ID_AC1 = 100;
                    let ID_AC10 = 1000;

                    async function purchase(coinBuy, crystalSell) {
                        try {
                            await accountSchema.findOneAndUpdate(
                                {User: interaction.user.id},
                                {
                                    $inc: {
                                        Wallet: -coinBuy,
                                        Crystal: crystalSell
                                    }
                                }
                            )
                        } catch(err) {
                            console.log(err);
                        }
                    }

                    if(buyItemChoice === "AC1") {
                        if(data.Wallet < ID_AC1) return interaction.reply({content: "Not enough money to buy this item!", ephemeral: true})

                        await purchase(100, 1)

                        let embed2 = new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setDescription("Thank you for your purchase of **1 <:8187:1163707516417486879> Angel Crystal**!")

                        return interaction.reply({embeds:[embed2]})
                    }

                    if(buyItemChoice === "AC10") {
                        if(data.Wallet < ID_AC10) return interaction.reply({content: "Not enough money to buy this item!", ephemeral: true})

                        await purchase(1000, 10)

                        let embed3 = new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setDescription("Thank you for your purchase of **10 <:8187:1163707516417486879> Angel Crystal**!")

                        return interaction.reply({embeds:[embed3]})
                    }
                } else {
                    return interaction.reply({embeds:[embed]})
                }

                if(sellItemChoice) {
                    return interaction.reply({content: "You're not able to sell anything yet.", ephemeral: true})
                }
            }
        }
    }
}