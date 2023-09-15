const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField } = require('discord.js');
const moment = require('moment');
const User = require('../../Schemas.js/rateSchema')

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

				let embed = new EmbedBuilder();
				if(mention.bot) {
					embed.setTitle("Bot Information")
				} else {
					embed.setTitle("User Information")
				}
				embed.setColor(mention.hexAccentColor || 'Random')
				embed.addFields(
					{ name: "Display Name", value: `${mention.globalName || mention.username}`, inline: true},
					{ name: "Username", value: `${mention.username}`, inline: true},
					{ name: "ID", value: mention.id, inline: false},
					{ name: "Creation Date", value: `${moment.utc(mention.createdAt).format('YYYY-MM-DD')}`, inline: true},
					{ name: "Join Date", value: `${moment.utc(mention.joinedAt).format('YYYY-MM-DD')}`, inline: true},
					// { name: "YI2E Flag", value: "Disabled", inline: true}
				)

				const user = await User.findOne({
					UserID: mention.id
				})

				if(user) {
					let userFilterReviews = user.Ratings.pop();
					let ratings = 0;

					user.Ratings.forEach((obj, index) => {
						ratings = (ratings + obj.StarRating)
					})

					ratings = ratings / user.Ratings.length;

					embed.setDescription(`**Last User Revieiw** \n **[${userFilterReviews.StarRating}/5 ★]** "${userFilterReviews.Comment}" **by ${userFilterReviews.Author}**`)
					embed.addFields(
						{ name: "Average Rating:", value: `${ratings.toFixed(2) || userFilterReviews.StarRating}/5 ★`, inline: true}
					)
				}

				embed.setImage(mention.bannerURL({ dynamic: true , size: 2048, format: "png" }))
				embed.setThumbnail(mention.displayAvatarURL())

				await interaction.reply({embeds: [embed]})
			} else {
				let user = await interaction.user.fetch({force:true});

				let embed = new EmbedBuilder()
				.setColor(user.hexAccentColor || 'Random')
				.setTitle("User Information")
				.addFields(
					{ name: "Display Name", value: `${user.globalName || user.username}`, inline: true},
					{ name: "Username", value: `${user.username}`, inline: true},
					{ name: "ID", value: user.id, inline: false},
					{ name: "Creation Date", value: `${moment.utc(user.createdAt).format('YYYY-MM-DD')}`, inline: true},
					{ name: "Join Date", value: `${moment.utc(user.joinedAt).format('YYYY-MM-DD')}`, inline: true}
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

					embed.setDescription(`**Last User Revieiw** \n **[${userFilterReviews.StarRating}/5 ★]** "${userFilterReviews.Comment}" **by ${userFilterReviews.Author}**`)
					embed.addFields(
						{ name: "Average Rating:", value: `${ratingse.toFixed(2) || userFilterReviews.StarRating}/5 ★`, inline: true}
					)
				}
				await interaction.reply({embeds: [embed]})
			}
		}

		if (interaction.options.getSubcommand() === 'server') {

			// console.log((await interaction.guild.channels.fetch()).map((m) => m))

			let serverEmbed = new EmbedBuilder()
			.setTitle("Server Information")
			.setColor("Random")
			.addFields(
				{ name: "Server Name", value: interaction.guild.name, inline: true},
				{ name: "Server ID", value: interaction.guild.id, inline: true},
				{ name: "Members", value: `${interaction.guild.memberCount}`, inline: true},
				{ name: "Owner", value: `${await interaction.client.users.fetch(interaction.guild.ownerId)}`, inline: true},
				// { name: "Channels", value: `E${(await interaction.guild.channels.fetch()).filter((m) => m.type === '0').size}`, inline: true},
				// { name: "Voice Channels", value: `T${(await interaction.guild.memberCount)}`, inline: true}
			)
			.setImage(`https://cdn.discordapp.com/banners/${interaction.guild.id}/${interaction.guild.banner}`)
			.setThumbnail(`https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}`)

			await interaction.reply({embeds: [serverEmbed]})
		}
	},
};