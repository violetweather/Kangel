const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = {
	category: 'moderation',
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge messages from chat or a specific member.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to purge').setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('The user to purge messages from')),
	async execute(interaction) {
        const member = interaction.options.getMember('target');
        const amount = interaction.options.getInteger('amount')

        const messages = await interaction.channel.messages.fetch({
            limit: amount+1,
        })

        const purgeEmbed = new EmbedBuilder()
        .setColor("Red")

        if(member) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if(msg.author.id === member.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await interaction.channel.bulkDelete(filtered).then(messages => {
                purgeEmbed.setDescription(`Purged ${messages.size} messages from ${member}.`);
                interaction.reply({embeds: [purgeEmbed]})
            })
        } else {
            await interaction.channel.bulkDelete(amount, true).then(messages => {
                purgeEmbed.setDescription(`Purged ${messages.size} messages.`)
                interaction.reply({embeds: [purgeEmbed]})
            })
        }
    }
}