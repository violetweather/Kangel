const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, ChannelType } = require('discord.js');
const staffSchema = require("../../Schemas.js/staff")

module.exports = {
	category: 'owner',
	data: new SlashCommandBuilder()
		.setName('staff')
		.setDescription('Kangel staff editing')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
                .addStringOption(option =>
                    option.setName('select')
                        .setDescription('Kangel staff options')
                        .setRequired(true)
                        .addChoices(
                            {name: 'Add', value: 'staff_add'},
                            {name: 'Delete', value: 'staff_del'}
                        ))
				.addUserOption(option => option.setName('target').setDescription('The user'))),
	async execute(interaction) {
        const targetUser = interaction.options.getUser('target')

		if (interaction.user.id === "785682850274869308") {
            if(interaction.options.getString("select") === 'staff_add') {
                const kangelStaff = await staffSchema.findOne({"Staff": [`${targetUser.id}`]})

                async function addStaffMember() {
                    staffSchema.create({
                        Staff: [
                            {
                                UserID: targetUser.id,
                                Username: targetUser.username,
                            }
                        ],
                    })
                    return;
                }

                // if(!kangelStaff) {
                //     interaction.reply({content: "Added user as Kangel Staff!", ephemeral: true})
                //     return addStaffMember();
                // }
            }
		} else {
			await interaction.reply({ content: 'You are not authorized to run this command.', ephemeral: true})
		}
    }
}