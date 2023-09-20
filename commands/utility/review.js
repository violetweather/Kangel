const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const User = require('../../Schemas.js/rateSchema')
const logger = require('../../logger');
const Server = require('../../Schemas.js/guildRateSchema')

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('review')
		.setDescription('Give a star rating and comment to a user, based on your experience')
        .addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Review a user')
                .addUserOption(
                    option => option.setName('target').setDescription('User to give star rating to.').setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('stars')
                    .setDescription('Rate from 1 to 5 stars your experience with the user!')
                    .addChoices(
                        {name: '★★★★★', value: '5'},
                        {name: '★★★★', value: '4'},
                        {name: '★★★', value: '3'},
                        {name: '★★', value: '2'},
                        {name: '★', value: '1'},
                    ).setRequired(true))
                .addStringOption(option => 
                    option.setName('comment')
                    .setDescription('Leave a commment on top of your star rating!')
                    .setMaxLength(30)
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Review the current server')
                .addStringOption(option => 
                    option.setName('stars')
                    .setDescription('Rate from 1 to 5 stars your experience with the user!')
                    .addChoices(
                        {name: '★★★★★', value: '5'},
                        {name: '★★★★', value: '4'},
                        {name: '★★★', value: '3'},
                        {name: '★★', value: '2'},
                        {name: '★', value: '1'},
                    ).setRequired(true))
                .addStringOption(option => 
                    option.setName('comment')
                    .setDescription('Leave a commment on top of your star rating!')
                    .setMaxLength(30)
                    .setRequired(true))).setDMPermission(false),
	async execute(interaction) {
        const starUser = interaction.options.getUser('target')
        const starAuthor = interaction.user.id
        const starComment = interaction.options.getString('comment')
        const starRating = interaction.options.getString('stars')

        if(interaction.options.getSubcommand() === 'user') {
            if(starUser.id === starAuthor) {
                return await interaction.reply({
                    content: 'Can\'t give a rating to yourself!',
                    ephemeral: true,
                })
            }
    
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
                .setDescription("You've added a review with the following information:")
                .addFields(
                    { name: "User Reviewed", value: `${starUser.username}`, inline: true},
                    { name: "Star Rating", value: `${starRating} ★`, inline: true},
                    { name: "Review Comment", value: `${starComment}`, inline: false}
                )
    
                await interaction.reply({embeds: [embed]})
    
                return createComment()
            } else if(user) {
                if(userAlreadyCommented) {
                    let embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription("You've edited your review with the following changes:")
                    .addFields(
                        { name: "User Reviewed", value: `${starUser.username}`, inline: true},
                        { name: "New Star Rating", value: `${starRating} ★`, inline: true},
                        { name: "Review Comment", value: `${starComment}`, inline: false}
                    )
        
                    await interaction.reply({embeds: [embed]})
                    await userAlreadyComment()
                    return;
                }
    
                let embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("You've added a review with the following information:")
                .addFields(
                    { name: "User Reviewed", value: `${starUser.username}`, inline: true},
                    { name: "Star Rating", value: `${starRating} ★`, inline: true},
                    { name: "Review Comment", value: `${starComment}`, inline: false}
                )
    
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

        if(interaction.options.getSubcommand() === 'server') {
            const server = await Server.findOne({
                ServerID: interaction.guild.id
            })
    
            async function createGuildComment() {
                Server.create({
                    ServerID: interaction.guild.id,
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
    
            async function serverAlreadyComment() {
                await Server.updateOne({ "ServerID": interaction.guild.id, "Ratings.AuthorID": interaction.user.id }, { $set: {
                    'Ratings.$.Author': interaction.user.username,
                    'Ratings.$.StarRating': starRating,
                    'Ratings.$.Comment': starComment
                }})
            }
    
            const serverAlreadyCommented =  await Server.findOne({ "ServerID": interaction.guild.id, "Ratings.AuthorID": interaction.user.id})

            if(!server) {
                let embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("You've added a review to this server with the following information:")
                .addFields(
                    { name: "Star Rating", value: `${starRating} ★`, inline: true},
                    { name: "Review Comment", value: `${starComment}`, inline: false}
                )
    
                await interaction.reply({embeds: [embed]})
    
                return createGuildComment()
            } else if(server) {
                if(serverAlreadyCommented) {
                    let embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription("You've edited your review for this server with the following changes:")
                    .addFields(
                        { name: "New Star Rating", value: `${starRating} ★`, inline: true},
                        { name: "Review Comment", value: `${starComment}`, inline: false}
                    )
        
                    await interaction.reply({embeds: [embed]})
                    await serverAlreadyComment()
                    return;
                }
    
                let embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("You've added a review to this server with the following information:")
                .addFields(
                    { name: "Star Rating", value: `${starRating} ★`, inline: true},
                    { name: "Review Comment", value: `${starComment}`, inline: false}
                )
    
                await interaction.reply({embeds: [embed]})
    
                await Server.updateOne({ "ServerID": interaction.guild.id}, { $push: { Ratings: {
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
}