const { SlashCommandBuilder, EmbedBuilder, Client, italic } = require('discord.js');

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
				.setDescription('Info about the server')),
	async execute(interaction) {

		if (interaction.options.getSubcommand() === 'user') {
			
			if(interaction.options.getUser('target')) {
				let mention = await interaction.options.getUser('target')
				await mention.banner
				
				let embed = new EmbedBuilder()
				.setTitle("User Information")
				.setColor(mention.hexAccentColor || 'Random')
				.addFields(
					{ name: "Display Name", value: `${mention.globalName}`, inline: true},
					{ name: "Username", value: `${mention.username}`, inline: true},
					{ name: "Created", value: `${mention.createdAt}`}
				)
				.setImage(`https://cdn.discordapp.com/banners/${mention.id}/${mention.banner}?size=1024`)
				.setThumbnail(`https://cdn.discordapp.com/avatars/${mention.id}/${mention.avatar}`)

				await interaction.reply({embeds: [embed]})
			} else {
				let user = await interaction.user;

				let embed = new EmbedBuilder()
				.setColor(user.hexAccentColor || 'Random')
				.setTitle("User Information")
				.addFields(
					{ name: "Display Name", value: `${user.globalName}`, inline: true},
					{ name: "Username", value: `${user.username}`, inline: true},
					{ name: "Created", value: `${user.createdAt}`}
				)
				.setImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=1024`)
			    .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)

				await interaction.reply({embeds: [embed]})
			}
		}

		if (interaction.options.getSubcommand() === 'server') {

			let serverEmbed = new EmbedBuilder()
			.setTitle("Server Information")
			.addFields(
				{ name: "Server Name", value: interaction.guild.name, inline: true},
				{ name: "Member Count", value: `${interaction.guild.memberCount}`, inline: true},
				{ name: "Owner", value: `${await interaction.client.users.fetch(interaction.guild.ownerId)}`}
			)
			.setImage(`https://cdn.discordapp.com/banners/${interaction.guild.id}/${interaction.guild.banner}`)
			.setThumbnail(`https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}`)

			await interaction.reply({embeds: [serverEmbed]})
		}
	},
};