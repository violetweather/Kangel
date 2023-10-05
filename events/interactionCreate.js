const { Events, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require("ms")
const cooldownDB = require('../Schemas.js/cooldowns')
const pollSchema = require('../Schemas.js/pollSchema')


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			await interaction.reply({ content: `No command matching ${interaction.commandName} was found or you do not have sufficient permissions.`, ephemeral: true})
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}

		if(!interaction.guild) return;
		if(!interaction.message) return;
		if(!interaction.isButton) return;

		const data = await pollSchema.findOne({Guild: interaction.guild.id, Message: interaction.message.id});
		if(!data) return;
		const msg = await interaction.channel.messages.fetch(data.Message)

		if(interaction.customId === "like") {
			if(data.LikeMembers.includes(interaction.user.id)) return await interaction.reply({ content: "You've already voted with a like on this poll.", ephemeral: true});

			let dislikeCount = data.Dislikes;
			if(data.DislikeMembers.includes(interaction.user.id)) {
				dislikeCount = dislikeCount - 1;
			}

			const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields({name: "Likes", value: `**${data.Likes + 1}**`, inline: true}, { name: "Dislikes", value: `**${dislikeCount}**`})
			const buttons = new ActionRowBuilder()
			.addComponents(
	
				new ButtonBuilder()
				.setCustomId("like")
				.setLabel("👍")
				.setStyle(ButtonStyle.Secondary),
	
				new ButtonBuilder()
				.setCustomId("dislike")
				.setLabel("👎")
				.setStyle(ButtonStyle.Secondary),
	
				new ButtonBuilder()
				.setCustomId('voted')
				.setLabel('🗳️')
				.setStyle(ButtonStyle.Secondary)
			)

			await interaction.update({embeds: [newEmbed], components: [buttons]});

			data.Likes++;

			if(data.LikeMembers.includes(interaction.user.id)){
				data.Dislikes = data.Dislikes-1;
			}

			data.LikeMembers.push(interaction.user.id);
			data.DislikeMembers.push(interaction.user.id);
			data.save();
		}


		if(interaction.customId === 'dislike') {
			if(data.DislikeMembers.includes(interaction.user.id)) return await interaction.reply({ content: "You can't vote again on this poll..!", ephemeral: true})

			let likesCount = data.Likes;
			if(data.LikeMembers.includes(interaction.user.id)) {
				likesCount = likesCount -1;
			}

			const newEmbed = EmbedBuilder.from(msg.embeds[0]).setFields({name: "Likes", value: `**${likesCount}**`, inline: true}, { name: "Dislikes", value: `**${data.Dislikes+1}**`, inline: true})
			const buttons = new ActionRowBuilder()
			.addComponents(
	
				new ButtonBuilder()
				.setCustomId("like")
				.setLabel("👍")
				.setStyle(ButtonStyle.Secondary),
	
				new ButtonBuilder()
				.setCustomId("dislike")
				.setLabel("👎")
				.setStyle(ButtonStyle.Secondary),
	
				new ButtonBuilder()
				.setCustomId('voted')
				.setLabel('🗳️')
				.setStyle(ButtonStyle.Secondary)
			)

			await interaction.update({embeds: [newEmbed], components: [buttons]});

			data.Dislikes++;

			if(data.LikeMembers.includes(interaction.user.id)) {
				data.Likes = data.Likes -1;
			}

			data.DislikeMembers.push(interaction.user.id);
			data.LikeMembers.push(interaction.user.id);
			data.save();
		}

		if(interaction.customId === "voted") {
			let likers = [];
			await data.LikeMembers.forEach(async member => {
				likers.push(`<@${member}>`)
			})

			let dislikers = [];
			await data.DislikeMembers.forEach(async member => {
				dislikers.push(`<@${member}>`)
			})

			const embed = new EmbedBuilder()
			.setColor("LuminousVividPink")
			.setTimestamp()
			.setTitle(`Users that voted in the poll by ${interaction.user}`)
			.addFields({ name: "Like", value: `**${likers.join(', ').slice(0, 1020) || "No one liked this poll.."}**`, inline: true})
			.addFields({ name: "Dislike", value: `**${dislikers.join(', ').slice(0, 1020) || "No one disliked this poll."}**`, inline: true})

			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	},
};