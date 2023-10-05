const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const pollSchema = require('../../Schemas.js/pollSchema')

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Start a poll!')
        .addStringOption(option => option.setName("topic").setDescription("Set the topic to your poll!").setMaxLength(1).setMaxLength(200).setRequired(true)),
	async execute(interaction) {

        await interaction.reply({content: "You've created a poll!", ephemeral: true})
        const topic = await interaction.options.getString("topic")
        const embed = new EmbedBuilder()
        .setColor("LuminousVividPink")
        .setTimestamp()
        .setTitle(`Poll started by ${interaction.user.username}`)
        .setDescription(`${topic}`)
        .addFields({ name: "Like", value: `**No votes**`, inline: true})
        .addFields({ name: "Dislike", value: `**No votes**`, inline: true})

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

        const msg = await interaction.channel.send({embeds: [embed], components: [buttons]});
        msg.createMessageComponentCollector();

        await pollSchema.create({
            Message: msg.id,
            Likes: 0,
            Dislikes: 0,
            LikeMembers: [],
            DislikeMembers: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id
        })
    }
}