
const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = {
	category: 'moderation',
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a Discord member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => 
                option.setName('delete_messages')
                .setDescription('How much of their recent message history is deleted')
                .addChoices(
                    {name: 'Past day', value: '24h'},
                    {name: 'Last 7 days', value: '7d'}
                ))
        .addStringOption(option =>
                option.setName('reason')
                .setDescription('Reason for banning the user.'))
        .addBooleanOption(option => 
                option.setName('knd')
                .setDescription('Global ban system synced to you (or an authoritative).')),
	async execute(interaction) {
        const member = interaction.options.getMember('target');
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason included.';
        const kndOption = interaction.options.getString('knd');
        const banClearDays = interaction.options.getString('delete_messages');
        const bannedList = await interaction.guild.bans.fetch();

        if(!member) {

            async function userBan() {
                let userEmbed = new EmbedBuilder()
                .setAuthor({ name: `${user.username} has been banned!`, iconURL: `${user.displayAvatarURL()}`})
                .setColor('DarkRed')
                .setDescription(`**Reason**: \n ${reason}`)
                .setFooter({ text: `Banned by ${interaction.user.username}.`});
    
                await interaction.guild.members.ban(user, {reason: reason})
                await interaction.reply({embeds: [userEmbed]})
                return;
            }

            if(bannedList.find((user) => user.id == user.id)) {
                await interaction.reply({ content: 'That user is already banned.', ephemeral: true})
                return;
            }

            return userBan();
        }

        if(member.id === interaction.guild.ownerId) {
            await interaction.reply({content: 'Kangel cannot ban the owner of the server!', ephemeral: true});
            return;
        }

        if(member.id === interaction.client.user.id) {
            await interaction.reply({content: 'https://tenor.com/view/honkai-gif-20937849', ephemeral: true});
            return;
        }

        const memberHighestRole = member.roles.highest.position;
        const authorHighestRole = interaction.member.roles.highest.position;
        const botHighestRole = interaction.guild.members.me.roles.highest.position;

        async function memberBan() {
            let memberEmbed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} has been banned!`, iconURL: `${member.displayAvatarURL()}`})
            .setColor('DarkRed')
            .setDescription(`**Reason**: \n ${reason}`)
            .setFooter({ text: `Banned by ${interaction.user.username}.`});

            let bannedEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`})
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`You've been banned in **${interaction.guild.name}** for **${reason}**`)

            user.send({embeds: [bannedEmbed]}).then().catch((e) => {
                console.log(e)
            })

            await member.ban({ reason: reason })
            await interaction.reply({embeds: [memberEmbed]})
            return;
        }

        if(memberHighestRole >= authorHighestRole) {
            await interaction.reply({ content: 'Cannot ban user with a higher or equal role.', ephemeral: true});
            return;
        }

        if(memberHighestRole >= botHighestRole) {
            await interaction.reply({content: 'kangel\'s roles are lower than the target user.', ephemeral: true});
            return;
        }

        try {
            if(bannedList.find((user) => user.id == member.id)) {
                await interaction.reply({ content: 'That user is already banned.', ephemeral: true})
                return;
            }

            memberBan()
        } catch(error) {
            console.log(error)
        }
    }
};