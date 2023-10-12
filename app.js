require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logger = require('./logger');
const kangel = new Client({ intents: [Object.keys(GatewayIntentBits)] });

kangel.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			kangel.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		kangel.once(event.name, (...args) => event.execute(...args));
	} else {
		kangel.on(event.name, (...args) => event.execute(...args));
	}
}

kangel.cooldowns = new Collection();
const Reminders = require("./Schemas.js/reminderSchema");
const remind = require('./commands/utility/remind');
setInterval(async () => {
	const reminds = await Reminders.find();
	if(!reminds) return;
	else {
		reminds.forEach( async reminder => {
			if(reminder.Time > Date.now()) return;

			let user = await kangel.users.fetch(reminder.User);

			user?.send({
				content: `WAKE UP! Kangel is reminding you.. \n \`\`\`${reminder.Remind}\`\`\``
			}).catch(err => {return;});

			await Reminders.deleteMany({
				Time: reminder.Time,
				User: user.id,
				Remind: reminder.Remind
			});
		})
	}
}, 1000 * 5);

const pollSchema = require("./Schemas.js/pollSchema");
kangel.on(Events.InteractionCreate, async interaction => {
	if(!interaction.guild) return;
	if(!interaction.message) return;
	if(!interaction.isButton) return;

	const data = await pollSchema.findOne({Guild: interaction.guild.id, Message: interaction.message.id});
	if(!data) return;
	const msg = await interaction.channel.messages.fetch(data.Message)

	if(interaction.customId === "like") {
		if(data.DislikeMembers.includes(interaction.user.id)) return await interaction.reply({ content: "You've already voted with a dislike on this poll.", ephemeral: true});
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
			data.DislikeMembers.pull(interaction.user.id)
			data.Dislikes = data.Dislikes-1;
		}

		data.LikeMembers.push(interaction.user.id);
		data.save();
	}


	if(interaction.customId === 'dislike') {
		if(data.LikeMembers.includes(interaction.user.id)) return await interaction.reply({ content: "You can't vote again on this poll..!", ephemeral: true})
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
			data.LikeMembers.pull(interaction.user.id)
			data.Likes = data.Likes -1;
		}

		data.DislikeMembers.push(interaction.user.id);
		data.save();
	}

	if(interaction.customId === "voted") {
		let likers = [];
		await data.LikeMembers.forEach(async member => {
			likers.push(`<@${member}>`)
		});

		let dislikers = [];
		await data.DislikeMembers.forEach(async member => {
			dislikers.push(`<@${member}>`)
		});

		const embed = new EmbedBuilder()
		.setColor("LuminousVividPink")
		.setTimestamp()
		.addFields({ name: "Like", value: `**${likers.join(', ').slice(0, 1020) || "No one liked this poll.."}**`, inline: true})
		.addFields({ name: "Dislike", value: `**${dislikers.join(', ').slice(0, 1020) || "No one disliked this poll."}**`, inline: true})

		await interaction.reply({embeds: [embed], ephemeral: true});
	}
})

kangel.on(Events.ClientReady, () => logger.info('The bot is online'));
kangel.on(Events.Debug, m => logger.debug(m));
kangel.on(Events.Warn, m => logger.warn(m));
kangel.on(Events.Error, m => logger.error(m));

kangel.login(process.env.TOKEN)