const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    category: "entertainment",
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Get the information for any Minecraft player or Minecraft server')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The minecraft username you want to look up.'))
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The minecraft server you want to look up.')),
	async execute(interaction) {
        const minecraftUser = interaction.options.getString('player');
        const minecraftServer = interaction.options.getString('server');

        if(minecraftUser) {
            let minecraftUserApi = `https://playerdb.co/api/player/minecraft/${minecraftUser}`
            let mcUserRes = await axios.get(minecraftUserApi)
                .catch(function (error) {
                    if (error.response) {
                        return interaction.reply({content: `${error.response.data.message}`, ephemeral: true});
                    } else if (error.request) {
                        return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                    } else {
                        return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                    }
                }
            )
    
            let player = mcUserRes.data.data.player
    
            if(player) {
                let mcUserSkin = `https://crafatar.com/renders/body/${player.id}`
                let embed = new EmbedBuilder()
                .setAuthor({ name: player.username, iconURL: player.avatar})
                .setColor("Random")
                .setImage(mcUserSkin)
    
                await interaction.reply({embeds: [embed]})
            } 
        }

        if(minecraftServer) {
            let minecraftServerApi = `https://api.mcsrvstat.us/3/${minecraftServer}`
            let mcServerRes = await axios.get(minecraftServerApi)
                .catch(function (error) {
                    if (error.response) {
                        return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                    } else if (error.request) {
                        console.log(error)
                        return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                    } else {
                        return interaction.reply({content: "An error occurred when running the command", ephemeral: true});
                    }
                }
            )

            let minecraftServerIconApi = `https://api.mcsrvstat.us/icon/${minecraftServer}`
            console.log(minecraftServerIconApi)

            let server = mcServerRes.data

            if(server.online === true) {
                let embed = new EmbedBuilder()
                .setDescription(`**${server.motd.clean[0]}** \n ${server.motd.clean[1]}`)
                .setColor('Green')
                .addFields(
                    { name: 'Hostname', value: `${server.hostname || server.ip}`, inline: true},
                    { name: 'Version', value: `${server.version}`, inline: true},
                    { name: 'Players', value: `${server.players.online}/${server.players.max}`, inline: true}
                )
                .setThumbnail(minecraftServerIconApi)

                await interaction.reply({embeds: [embed]})
            }
        }
    }
}