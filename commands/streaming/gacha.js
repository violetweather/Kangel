const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const gachaPull = require("../../utilities/gachaPullRate")

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
                                ))),
    async execute(interaction) {
        const { options, user, guild } = interaction;
        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err => {})

        return interaction.reply({content: "Not available yet.", ephemeral: true})

        switch(options.getSubcommand()) {
            case "info": {
                let embed = new EmbedBuilder()
                .setTitle("Welcome to the Heavenly Gacha")
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `You will be able to pull for items and Kangel's favorite characters!`,
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
                let embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .addFields(
					{ name: `**BETA** Featured 0★ Heavenly Gacha Banner`,
						value: [
							`Pull for a chance to get a 0★! (1 pull = 1 <:8187:1163707516417486879> | 10 pull = 80 <:8187:1163707516417486879> [discount!])`,
                            `Characters & Items have a 0-3 star rating, with the most valuable being at 3 star, and the least at 0 star.`
						].join("\n"),
					},
				)

                interaction.reply({embeds:[embed]})
            }
            break;
            case "pull": {
                const selection = interaction.options.getString('banner');
                if(!data) return interaction.reply({content: "You haven't created Kangel a streamer account..", ephemeral: true})
                if(data.Crystal === 0) return interaction.reply({content: "Kangel needs <:8187:1163707516417486879> 10 Angel Crystals to pull on banners.", ephemeral: true})
                if(data.Crystal < 10) return interaction.reply({content: "Kangel needs <:8187:1163707516417486879> 10 Angel Crystals to pull on banners.", ephemeral: true})
                const pullAmount = interaction.options.getString('choice');

                await gachaPull(interaction, selection, pullAmount)
            }
        }
    }
}