const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const repSchema = require('../../Schemas.js/rep')

module.exports = {
//    cooldown: 86400,
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('Give a star rating to a user, based on your experience')
		.addUserOption(
            option => option.setName('user').setDescription('User to give star rating to.').setRequired(true)
        )
        .addStringOption(option => 
            option.setName('stars')
            .setDescription('Rate from 1 to 5 stars your experience with the user!')
            .setRequired(true)
            .addChoices(
                {name: '★★★★★', value: 'five_star'},
                {name: '★★★★', value: 'four_star'},
                {name: '★★★', value: 'three_star'},
                {name: '★★', value: 'two_star'},
                {name: '★', value: 'one_star'},
            ))
        .addStringOption(option => 
            option.setName('comment')
            .setDescription('Leave a commment on top of your star rating!')
            .setMaxLength(30)
            .setRequired(true)),
	async execute(interaction) {
        const repUser = interaction.options.getUser('user')
        const repComment = interaction.options.getString('comment')
        const repPoint = interaction.options.getString('reputation')
        
        // if(repUser.id === interaction.user.id) {
        //     return await interaction.reply({ content: "Can't give or take away reputation from yourself!", ephemeral: true });
        // }

        // const embed = new EmbedBuilder()
        // .addFields({ name: 'User', value: `${repUser.username}`})
        // .addFields({ name: 'Comment', value: `${repComment}`})

        // const userData = await repSchema.findOne({
        //     UserID: repUser.id
        // })

        // if(!userData) {
        //     if(repPoint === 'pos') {
        //         repSchema.create({
        //             Author: interaction.user.username,
        //             UserID: repUser.id,
        //             Reputation: 1,
        //             Comment: repComment,
        //         })

        //         embed.setDescription(`You gave a reputation point to **${repUser.username}**`)
        //         embed.setColor("Green")
        //         await interaction.reply({ embeds: [embed]})
        //     } else if (repPoint === 'neg') {
        //         repSchema.create({
        //             Author: interaction.user.username,
        //             UserID: repUser.id,
        //             Reputation: -1,
        //             Comment: repComment,
        //         })

        //         embed.setDescription(`You gave a negative point to **${repUser.username}**`)
        //         embed.setColor("Red")
        //         await interaction.reply({ embeds: [embed]})
        //     }
        // } else if (userData) {
        //     if(repPoint === 'pos') {
        //         await repSchema.updateOne({ "UserID": repUser.id}, { Author: interaction.user.username, Reputation: `${userData.Reputation+1}`, Comment: `${repComment}`})
        //         embed.setDescription(`You gave a reputation point to **${repUser.username}**`)
        //         embed.setColor("Green")
        //         await interaction.reply({ embeds: [embed]})
        //     } else if (repPoint === 'neg') {
        //         await repSchema.updateOne({ "UserID": repUser.id}, { Author: interaction.user.username, Reputation: `${userData.Reputation-1}`, Comment: `${repComment}`})
        //         embed.setDescription(`You gave a negative point to **${repUser.username}**`)
        //         embed.setColor("Red")
        //         await interaction.reply({ embeds: [embed]})
        //     }
        // } else if (error) {
        //     return console.log(err);
        // }
    }
}