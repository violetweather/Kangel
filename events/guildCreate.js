const { Events, Collection, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {

        let embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`Thanks for adding ${guild.client.user.username} to ${guild.name}!`)
        .setDescription("**kangel** is a *multi-functional* bot! \n - With the ability to moderate your server, entertain users, and provide unique features!")
        .addFields(
            { name: "Set up moderation now!", value: "`/setup`"},
            { name: "Try a fun command!", value: "`/translate`"},
        )
        .setThumbnail(guild.client.user.displayAvatarURL())
        .setFooter({ text: `Made with love by @violetweather <3`})

        if(guild.systemChannelId === null) {
            guild.client.guilds.cache.forEach(async(channel) => {
                if (channel.type == "text") {
                    if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                        await guild.systemChannel.send({embeds: [embed]})
                    }
                }
            })
        } else {
            await guild.systemChannel.send({embeds: [embed]})
        }
    }
};