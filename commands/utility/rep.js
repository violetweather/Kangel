const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const repSchema = require('../../Schemas.js/rep')

module.exports = {
    cooldown: 86400,
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDescription('Give or take away reputation from users based on your experience with them.')
		.addUserOption(
            option => option.setName('user').setDescription('User to give reputation to or take away.').setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reputation')
            .setDescription('Add or take away reputation based on your experience with the user.')
            .setRequired(true)
            .addChoices(
                {name: 'Positive', value: 'pos'},
                {name: 'Negative', value: 'neg'}
            ))
        .addStringOption(option => 
            option.setName('comment')
            .setDescription('Leave a commment as to why you are giving or taking away reputation from selected user.')
            .setMaxLength(30)
            .setRequired(true)),
	async execute(interaction) {
        const repUser = interaction.options.getUser('user')
        const repComment = interaction.options.getString('comment')
        const repPoint = interaction.options.getString('reputation')
        
        const embed = new EmbedBuilder()
        .addFields({ name: 'User', value: `${repUser.username}`})
        .addFields({ name: 'Comment', value: `${repComment}`})

        const userData = await repSchema.findOne({
            UserID: repUser.id
        })

        if(!userData) {
            if(repPoint === 'pos') {
                repSchema.create({
                    Author: interaction.user.username,
                    UserID: repUser.id,
                    Reputation: 1,
                    Comment: repComment,
                })

                embed.setDescription(`You gave a reputation point to **${repUser.username}**`)
                embed.setColor("Green")
                await interaction.reply({ embeds: [embed]})
            } else if (repPoint === 'neg') {
                repSchema.create({
                    Author: interaction.user.username,
                    UserID: repUser.id,
                    Reputation: -1,
                    Comment: repComment,
                })

                embed.setDescription(`You gave a negative point to **${repUser.username}**`)
                embed.setColor("Red")
                await interaction.reply({ embeds: [embed]})
            }
        } else if (userData) {
            if(repPoint === 'pos') {
                await repSchema.updateOne({ "UserID": repUser.id}, { Author: interaction.user.username, Reputation: `${userData.Reputation+1}`, Comment: `${repComment}`})
                embed.setDescription(`You gave a reputation point to **${repUser.username}**`)
                embed.setColor("Green")
                await interaction.reply({ embeds: [embed]})
            } else if (repPoint === 'neg') {
                await repSchema.updateOne({ "UserID": repUser.id}, { Author: interaction.user.username, Reputation: `${userData.Reputation-1}`, Comment: `${repComment}`, Updated: `${Date.now}`})
                embed.setDescription(`You gave a negative point to **${repUser.username}**`)
                embed.setColor("Red")
                await interaction.reply({ embeds: [embed]})
            }
        } else if (eror) {
            return console.log(err);
        }
    }
}