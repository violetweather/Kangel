const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');
const staffSchema = require("../../Schemas.js/staff")

module.exports = {
	category: 'owner',
    owner: true,
	data: new SlashCommandBuilder()
		.setName('owner')
		.setDescription('Owner command only')
		.addSubcommand(subcommand =>
			subcommand
				.setName('staff')
				.setDescription('Add/edit kangel staff')
                .addStringOption(option =>
                    option.setName('select')
                        .setDescription('Kangel staff options')
                        .setRequired(true)
                        .addChoices(
                            {name: 'add', value: 'staff_add'},
                            {name: 'delete', value: 'staff_del'}
                        ))
				.addUserOption(option => option.setName('target').setDescription('The user'))),
	async execute(interaction) {
        const targetUser = interaction.options.getUser('target')

        if(interaction.options.getString("select") === 'staff_add') {
            let kangelStaff = await staffSchema.findOne({"UserID": `${targetUser.id}`})

            async function addStaffMember() {
                staffSchema.create({
                        UserID: targetUser.id,
                        Username: targetUser.username,
                })
                return;
            }

            if(!kangelStaff) {
                interaction.reply({content: "Added user as Kangel Staff!", ephemeral: true})
                return addStaffMember();
            }

            if(kangelStaff) {
                interaction.reply({content: "User is already a staff member.", ephemeral: true})
                return;
            }
        }

        if(interaction.options.getString("select") === 'staff_del') {
            let kangelStaff = await staffSchema.findOne({"UserID": `${targetUser.id}`})

            async function delStaffMember() {
                staffSchema.deleteOne({"UserID": `${targetUser.id}`}, {
                        UserID: targetUser.id,
                        Username: targetUser.username,
                })
                return;
            }

            interaction.reply({content: "Staff user deleted.", ephemeral: true})
            return delStaffMember();
        }
    }
}