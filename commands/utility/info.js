const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');
const moment = require('moment');
const User = require('../../Schemas.js/rateSchema')
const Server = require('../../Schemas.js/guildRateSchema')

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provides information about the user or server.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Info about the server')
				).setDMPermission(false),
	async execute(interaction) {

		if (interaction.options.getSubcommand() === 'user') {
			
			if(interaction.options.getUser('target')) {
				let mention = await interaction.options.getUser('target').fetch({force: true})

				function formatBytes(a, b) {
					let c = 1024
					d = b || 2 
					e = ['B', 'KB', 'MB', 'GB', 'TB']
					f = Math.floor(Math.log(a) / Math.log(c))

					return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
				}

				let embed = new EmbedBuilder();

				embed.setColor(mention.hexAccentColor || 'Random')
				embed.addFields(
					{ name: `${mention.globalName || mention.username}`,
						value: [
							`**Creation Date**: <t:${parseInt(mention.createdAt/1000)}:R>`,
							`**Username**: ${mention.username}`,
							`**ID**: ${mention.id}`,
						].join("\n"),
					},
				)

				const user = await User.findOne({
					UserID: mention.id
				})

				if(mention.id === "1140470772108906630") {
					embed.addFields(
						{ name: `<:heart:1155448985956397078> My stats`,
							value: [
								`**Ping**: ${interaction.client.ws.ping}ms`,
								`**Memory Used**: ${formatBytes(process.memoryUsage().heapUsed)}`,
								`**Node Version**: ${process.version}`,
							].join("\n"),
							inline: true
						},
					)
				}

				if(user) {
					let userFilterReviews = user.Ratings.pop();
					let ratings = 0;

					user.Ratings.forEach((obj, index) => {
						ratings = (ratings + obj.StarRating)
					})

					ratings = ratings / user.Ratings.length;

					embed.addFields(
						{ name: `✒️ Latest Review`,
							value: [
							`**Star Rating**: ${userFilterReviews.StarRating}/5 ★`,
							`**Review Comment**: ${userFilterReviews.Comment}`,
							`**Review Author**: ${userFilterReviews.Author}`,
						].join("\n"),
						inline: true
						}
					)

					if(!isNaN(ratings)) {
						embed.addFields(
							{ name: "⭐ Average Rating:", value: `${ratings.toFixed(2)}/5.00 ★`, inline: true}
						)
					}
				}

				embed.setImage(mention.bannerURL({ dynamic: true , size: 2048, format: "png" }))
				embed.setThumbnail(mention.displayAvatarURL())

				await interaction.reply({embeds: [embed]})
			} else {
				let user = await interaction.user.fetch({force:true});

				let embed = new EmbedBuilder()
				.setColor(user.hexAccentColor || 'Random')
				embed.addFields(
					{ name: `${user.globalName || user.username}`,
						value: [
							`**Creation Date**: <t:${parseInt(user.createdAt/1000)}:R>`,
							`**Username**: ${user.username}`,
							`**ID**: ${user.id}`,
						].join("\n"),
					},
				)

				.setImage(user.bannerURL({ dynamic: true , size: 2048, format: "png" }))
			    .setThumbnail(user.displayAvatarURL());


				const userSelf = await User.findOne({
					UserID: user.id
				})

				if(userSelf) {
					let userFilterReviews = userSelf.Ratings.pop();
					let ratingse = 0;

					userSelf.Ratings.forEach((obj, index) => {
						ratingse = (ratingse + obj.StarRating)
					})

					ratingse = ratingse / userSelf.Ratings.length;

					embed.addFields(
						{ name: `✒️ Latest Review`,
							value: [
							`**Star Rating**: ${userFilterReviews.StarRating}/5 ★`,
							`**Review Comment**: ${userFilterReviews.Comment}`,
							`**Review Author**: ${userFilterReviews.Author}`,
						].join("\n"),
						inline: true
						}
					)

					if(!isNaN(ratingse)) {
						embed.addFields(
							{ name: "⭐ Average Rating:", value: `${ratingse.toFixed(2)}/5.00 ★`, inline: true}
						)
					}
				}
				await interaction.reply({embeds: [embed]})
			}
		}

		if (interaction.options.getSubcommand() === 'server') {

			let channelCount = await interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews).size
			let vchannelCount = await interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size

			let serverEmbed = new EmbedBuilder()
			.setColor("Random")
			.addFields(
				{ name: `${interaction.guild.name}`,
					value: [
						`**Created**: <t:${parseInt(interaction.guild.createdAt/1000)}:R>`,
						`**ID**: ${interaction.guild.id}`,
						`**Owner**: ${await interaction.client.users.fetch(interaction.guild.ownerId)}`
					].join("\n"),
				},
				{ name: `⚙️ General`,
				value: [
					`**Users**: ${interaction.guild.memberCount}`,
					`**Channels**: ${channelCount}`,
					`**Voice Channels:**: ${vchannelCount || 0}`,
				].join("\n"),
				inline: true
				},
				{ name: `🎉 Emotes`,
					value: [
						`**Standard Emotes**: ${interaction.guild.emojis.cache.filter(emote => !emote.animated).size}`,
						`**Animated Emotes**: ${interaction.guild.emojis.cache.filter(emote => emote.animated).size}`,
						`**Stickers**: ${interaction.guild.stickers.cache.size}`,
					].join("\n"),
					inline: true
				},
				{ name: `📈 Nitro`,
				value: [
					`**Nitro Boosters**: ${interaction.guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
					`**Nitro Boosts**: ${interaction.guild.premiumSubscriptionCount}`,
					`**Nitro Level**: ${interaction.guild.premiumTier || "0"}`,
				].join("\n"),
				inline: true
			},
			)
			.setImage(interaction.guild.bannerURL({size: 1024}))
			.setThumbnail(interaction.guild.iconURL({size: 1024}))

			const server = await Server.findOne({
				ServerID: interaction.guild.id
			})

			if(server) {
				let serverFilterReviews = server.Ratings.pop();
				let ratings = 0;

				server.Ratings.forEach((obj, index) => {
					ratings = (ratings + obj.StarRating)
				})

				ratings = ratings / server.Ratings.length;

				serverEmbed.addFields(
					{ name: `✒️ Latest Review`,
						value: [
						`**Star Rating**: ${serverFilterReviews.StarRating}/5 ★`,
						`**Review Comment**: ${serverFilterReviews.Comment}`,
						`**Review Author**: ${serverFilterReviews.Author}`,
					].join("\n"),
					inline: true
					}
				)

				if(!isNaN(ratings)) {
					serverEmbed.addFields(
						{ name: "⭐ Average Rating:", value: `${ratings.toFixed(2)}/5.00 ★`, inline: true}
					)
				}
			}

			await interaction.reply({embeds: [serverEmbed]})
		}
	},
};