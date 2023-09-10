const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const starRate = require('../../Schemas.js/rateSchema')
const logger = require('../../logger');

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
                {name: '★★★★★', value: '5'},
                {name: '★★★★', value: '4'},
                {name: '★★★', value: '3'},
                {name: '★★', value: '2'},
                {name: '★', value: '1'},
            ))
        .addStringOption(option => 
            option.setName('comment')
            .setDescription('Leave a commment on top of your star rating!')
            .setMaxLength(30)
            .setRequired(true)),
	async execute(interaction) {
        const starUser = interaction.options.getUser('user')
        const starAuthor = interaction.user.id
        const starComment = interaction.options.getString('comment')
        const starRating = interaction.options.getString('stars')
        
        if(starUser.id === starAuthor) {
            return await interaction.reply({
                content: 'Can\'t give a rating to yourself!',
                ephemeral: true,
            })
        }

        const embed = new EmbedBuilder()
        .addFields({ name: 'User', value: `${starUser.username}`})
        .addFields({ name: 'Comment', value: `${starComment}`})

        const userData = await starRate.findOne({
            UserID: starUser.id
        })

        if(!userData) {
            starRate.create({
                Author: interaction.user.username,
                UserID: starUser.id,
                StarRating: starRating,
                Comment: starComment
            })
        } else if(userData) {
            logger.info("User data :)")
        } else if(error) {
            return console.log(error);
        }

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