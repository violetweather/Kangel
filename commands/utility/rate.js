const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const User = require('../../Schemas.js/rateSchema')
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

        const user = await User.findOne({
            UserID: starUser.id
        })

        async function createComment() {
            User.create({
                UserID: starUser.id,
                Ratings: [
                    {
                        AuthorID: interaction.user.id,
                        Author: interaction.user.username,
                        Comment: starComment,
                        StarRating: starRating,
                    }
                ],
            })
            return;
        }

        async function userAlreadyComment() {
            await User.updateOne({ "UserID": starUser.id, "Ratings.AuthorID": interaction.user.id }, { $set: {
                'Ratings.$.Author': interaction.user.username,
                'Ratings.$.StarRating': starRating,
                'Ratings.$.Comment': starComment
            }})
        }

        const userAlreadyCommented =  await User.findOne({ "UserID": starUser.id, "Ratings.AuthorID": interaction.user.id})

        if(!user) {
            let embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`You've given **${starUser.username}** a **${starRating} star rating**! With the following comment: \n "${starComment}"`)

            await interaction.reply({embeds: [embed]})

            return createComment()
        } else if(user) {
            if(userAlreadyCommented) {
                let embed = new EmbedBuilder()
                .setColor("Orange")
                .setDescription(`You've edited a rating for **${starUser.username}** with a **${starRating} star rating**! \n *With the following comment*: \n "${starComment}"`)
    
                await interaction.reply({embeds: [embed]})
                await userAlreadyComment()
                return;
            }

            let embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`You've given **${starUser.username}** a **${starRating} star rating**! With the following comment: \n "${starComment}"`)

            await interaction.reply({embeds: [embed]})

            await User.updateOne({ "UserID": starUser.id}, { $push: { Ratings: {
                AuthorID: interaction.user.id,
                Author: interaction.user.username,
                StarRating: starRating,
                Comment: starComment
            }}})
            return;
        } else if(error) {
            return console.log(error);
        }
    }
}