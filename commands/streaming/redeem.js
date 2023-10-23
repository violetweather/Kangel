const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const redeemsFile = require('../../utilities/redeems')

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('redeem')
		.setDescription('Redeem codes for Kangel!')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Which code would you like to redeem?')
                .setRequired(true)),
    async execute(interaction) {
        let data = await accountSchema.findOne({User: interaction.user.id}).catch(err => {})
        const codeInput = interaction.options.getString('code');

        if(!data) return interaction.reply({content: "You cannot redeem a code, you must make Kangel a streamer account!", ephemeral: true})
        
        let redeemMatch = redeemsFile.filter(
            function(l) { 
                return l.code.toUpperCase() === codeInput.toUpperCase()
            }
        )

        let codeRedeemed = redeemMatch[0]

        if(!codeRedeemed) {
            return interaction.reply({content: "Invalid code or already expired.", ephemeral: true})
        }

        if(codeRedeemed.expired === true) return interaction.reply({content: "Code has already expired.", ephemeral: true})

        let userAlreadyRedeem = await accountSchema.findOne({"User": interaction.user.id, "Redeems.RedeemCode": codeRedeemed.code}).catch(err => {})
        if(userAlreadyRedeem) return interaction.reply({content: "Code already claimed.", ephemeral: true})

        await accountSchema.findOneAndUpdate({ "User": interaction.user.id}, { $push: { Redeems: {
            RedeemCode: codeRedeemed.code
        }}})

        let embed = new EmbedBuilder()
        .setTitle(`You have redeemed ${codeRedeemed.code}`)
        .setColor("LuminousVividPink")

        if(codeRedeemed.coins_awarded > 0) {
            embed.addFields({name: "Coins:", value: `**+ ${codeRedeemed.coins_awarded} <:coins:1163712428975079456> Angel Coins**`})
        }

        if(codeRedeemed.crystals_awarded > 0) {
            embed.addFields({name: "Crystals:", value: `**+ ${codeRedeemed.crystals_awarded} <:8187:1163707516417486879> Angel Crystals**`})
        }

        try {
            await accountSchema.findOneAndUpdate(
                {User: interaction.user.id},
                {
                    $inc: {
                        Wallet: codeRedeemed.coins_awarded,
                        Crystal: codeRedeemed.crystals_awarded 
                    }
                }
            )
        } catch(err) {
            console.log(err);
        }

        interaction.reply({embeds:[embed]})
    }
}