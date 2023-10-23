const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const Banner = require("../../Schemas.js/banners")
const gachaPull = require("../../utilities/gachaPullRate")
const parseMs = require("parse-ms-2")

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
        let data = await accountSchema.findOne({User: user.id}).catch(err => {})

        if(!data) return interaction.reply({content: "You cannot redeem a code, you must make Kangel a streamer account!", ephemeral: true})
        
    }
}