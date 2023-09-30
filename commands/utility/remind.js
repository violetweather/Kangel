const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Reminders = require("../../Schemas.js/reminderSchema")

module.exports = {
    category: "utility",
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Set reminders for things you might need to remember.')
        .addSubcommand(option =>
            option.setName('set')
                .setDescription('Set a reminder')
		.addStringOption(option =>
			option.setName('reminder')
				.setDescription('Write what you want to be reminded about!')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription("How many minutes from now?")
                .setMinValue(0)
                .setMaxValue(59)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription("How many days from now?")
                .setMinValue(1)
                .setMaxValue(31))
        .addIntegerOption(option =>
            option.setName('hours')
                .setDescription("How many hours from now?")
                .setMinValue(0)
                .setMaxValue(23))),
    async execute(interaction) {
        const { options, guild } = interaction;
        const reminder = options.getString("reminder")
        const minute = options.getInteger("minutes") || 0;
        const hour = options.getInteger("hours") || 0;
        const day = options.getInteger("days") || 0;

        let time = Date.now() + (day * 1000 * 60 * 60 * 24) + (hour * 1000 * 60 * 60) + (minute * 1000 * 60);

        await Reminders.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder
        });

        const embed = new EmbedBuilder()
        .setColor("LuminousVividPink")
        .addFields(
            { name: `<:heart:1155448985956397078> Kangel will remind you!`,
                value: [
                    `**Reminder set for**: <t:${Math.floor(time/1000)}:R>`,
                    `**What you will be reminded for**: ${reminder}`,
                ].join("\n"),
                inline: true
            },
        )

        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}