const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const accountSchema = require("../../Schemas.js/account")
const parseMs = require("parse-ms-2")
const { dailyMin, dailyMax } = require("../../utilities/daily.json")
const { stressMin, stressMax } = require("../../utilities/stressStat.json")
const { affectionMin, affectionMax } = require("../../utilities/affectionStat.json")
const { mentalMin, mentalMax } = require("../../utilities/mentalStat.json")
const checkDailies = require("../../utilities/checkDailies")
const streamComments = require("../../utilities/streamComments.json")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Do your daily activities with Kangel!')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('sillies')
                .setDescription('Do some silly stuff with Kangel :wink:'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('medications')
                        .setDescription('Help Kangel feel better.. or worse')
                        .addStringOption(option =>
                            option.setName('give')
                                .setDescription('Select a certain something')
                                .setRequired(true)
                                .addChoices(
                                    {name: '🚬🌈 Magic Smoke', value: 'magic_smoke'},
                                    {name: '💊 Dyslem', value: `dyslem`}
                        )))
                        .addSubcommand(subcommand =>
                            subcommand
                                .setName('stream')
                                .setDescription('Make Kangel stream once a day!')
                                .addStringOption(option =>
                                    option.setName('topic')
                                        .setDescription('Set a topic for your stream!')
                                        .setRequired(true)
                                        .addChoices(
                                            {name: '🍿 Entertainment', value: 'entertain'},
                                            {name: '❤️ Chill', value: 'chill'},
                                            {name: '👻 Scary', value: 'scary'}
                                )))
                                .addSubcommand(subcommand =>
                                    subcommand
                                        .setName('internet')
                                        .setDescription('Browse the Internet with Kangel!')
                                        .addStringOption(option =>
                                            option.setName('where')
                                                .setDescription('Select where to go on the internets')
                                                .setRequired(true)
                                                .addChoices(
                                                    {name: '/st/', value: 'st'},
                                        ))),
    async execute(interaction) {
        const { options, user, guild } = interaction;
        let data = await accountSchema.findOne({Guild: interaction.guild.id, User: interaction.user.id}).catch(err => {})
        const randomStress = Math.floor(Math.random() * (stressMax - stressMin + 1) + stressMin);
        const randomMental = Math.floor(Math.random() * (mentalMax - mentalMin + 1) + mentalMin);
        const randomAffection = Math.floor(Math.random() * (affectionMax - affectionMin + 1) + affectionMin);
        const values = Object.values(streamComments)
        const randomValue = values[parseInt(Math.random() * values.length)]

        switch(options.getSubcommand()) {
            case "sillies": {
                if(data) {
                    if(data.DailyActivityCount > 0) {
                        checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    } else if (data.DailyActivityCount === 0) {
                        return checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    }
        
                    let embed = new EmbedBuilder()
                    .setImage(`https://media.tenor.com/cqja9fAbYgUAAAAd/needy-girl-overdose-sex.gif`)
                    .setColor("LuminousVividPink")
        
                    try {
                        await accountSchema.findOneAndUpdate(
                            {Guild: interaction.guild.id, User: interaction.user.id},
                            {
                                $inc: {
                                    DailyActivityCount: -1,
                                    StressStat: -randomStress*0.5,
                                    MentalDarknessStat: -randomMental*1.3,
                                    AffectionStat: randomAffection*1.1,
                                }
                            }
                        )
                    } catch(err) {
                        console.log(err);
                    }
        
                    embed.addFields(
                        { name: `<:heart:1155448985956397078>`,
                            value: [
                                `Kangel's stress went down by **${randomStress*0.5.toFixed(2)}**!`,
                                `Kangel's affection went up by **${randomAffection*1.1.toFixed(2)}**!`,
                                `Kangel's mental darkness went down by **${randomMental*1.3.toFixed(2)}**!`
                            ].join("\n"),
                            inline: true
                        },
                    )
        
                    return interaction.reply({embeds: [embed]})
                } else {
                    return interaction.reply("You need to make Kangel a streaming account first!")
                }
            }
            break;
            case "medications": {
                if(data) {
                    if(data.DailyActivityCount > 0) {
                        checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    } else if (data.DailyActivityCount === 0) {
                        return checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    }
        
                    switch(options.getString("give")) {
                        case "magic_smoke": {
                            let embed = new EmbedBuilder()
                            .setImage(`https://media.tenor.com/Cg2xFB_tvX8AAAAd/needy-streamer-overload.gif`)
                            .setColor("LuminousVividPink")
                
                            try {
                                await accountSchema.findOneAndUpdate(
                                    {Guild: interaction.guild.id, User: interaction.user.id},
                                    {
                                        $inc: {
                                            DailyActivityCount: -1,
                                            StressStat: -randomStress*1.5,
                                            MentalDarknessStat: +randomMental*0.6
                                        }
                                    }
                                )
                            } catch(err) {
                                console.log(err);
                            }
                
                            embed.addFields(
                                { name: `<:heart:1155448985956397078> Magic Smoke!`,
                                    value: [
                                        `Kangel's stress went down by **${randomStress*1.5.toFixed(2)}**!`,
                                        `Kangel's mental darkness went up by **${randomMental*0.6.toFixed(2)}**!`
                                    ].join("\n"),
                                    inline: true
                                },
                            )
                
                            return interaction.reply({embeds: [embed]})
                        }
                        break;
                        case "dyslem": {
                            let embed = new EmbedBuilder()
                            .setImage(`https://media.tenor.com/c5oQLAH0MQ8AAAAC/medication-tablet-medicine.gif`)
                            .setColor("LuminousVividPink")
                
                            try {
                                await accountSchema.findOneAndUpdate(
                                    {Guild: interaction.guild.id, User: interaction.user.id},
                                    {
                                        $inc: {
                                            DailyActivityCount: -1,
                                            StressStat: -randomStress*1.2,
                                            MentalDarknessStat: +randomMental*0.5
                                        }
                                    }
                                )
                            } catch(err) {
                                console.log(err);
                            }
                
                            embed.addFields(
                                { name: `<:heart:1155448985956397078> Dylsem!`,
                                    value: [
                                        `Kangel's stress went down by **${randomStress*1.2.toFixed(2)}**!`,
                                        `Kangel's mental darkness went up by **${randomMental*0.5.toFixed(2)}**!`
                                    ].join("\n"),
                                    inline: true
                                },
                            )
                
                            return interaction.reply({embeds: [embed]})
                        }
                    }
                } else {
                    return interaction.reply("You need to make Kangel a streaming account first!")
                }
            }
            break;
            case "stream": {
                if(data) {
                    const cooldown = 86400000;
                    const timeLeft = cooldown - (Date.now() - data.LastDaily);
            
                    if(timeLeft > 0) {
                        const { hours, minutes, seconds } = parseMs(timeLeft);
                        return interaction.reply({content: `Streaming is tiring.. come back in ${hours} hours ${minutes} minutes ${seconds} seconds`, ephemeral: true});
                    }
        
                    if(data.DailyActivityCount > 0) {
                        checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    } else if (data.DailyActivityCount === 0) {
                        return checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    }
                    
                    const randomFollower = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);
                    let randomAmount = randomFollower*4
        
                    const randomStress = Math.floor(Math.random() * (stressMax - stressMin + 1) + stressMin);
                    const randomMental = Math.floor(Math.random() * (mentalMax - mentalMin + 1) + mentalMin);
                    const randomAffection = Math.floor(Math.random() * (affectionMax - affectionMin + 1) + affectionMin);
                    
                    async function dailyStreamDB(stressTimes, affectionTimes, mentalTimes, followerTimes, walletTimes) {
                        try {
                            await accountSchema.findOneAndUpdate(
                                {Guild: interaction.guild.id, User: interaction.user.id},
                                {
                                    $set: {
                                        LastDaily: Date.now(),
                                    },
                                    $inc: {
                                        Followers: randomFollower*followerTimes.toFixed(0),
                                        Wallet: randomAmount*walletTimes.toFixed(0),
                                        DailyActivityCount: -1,
                                        StressStat: randomStress*stressTimes,
                                        MentalDarknessStat: randomMental*mentalTimes,
                                        AffectionStat: -randomAffection*affectionTimes,
                                    }
                                }
                            )
                        } catch(err) {
                            console.log(err);
                        }
                    }
        
                    const embed = new EmbedBuilder()
                    .setImage(`${randomValue}`)
                    .setColor("LuminousVividPink")
        
                    if(interaction.options.getString('topic') === "entertain") {
                        dailyStreamDB(1.2, 0.3, 1.1, 1.1, 1.1)
                        embed.setTitle("🍿 Entertainment Stream!")
                        embed.addFields(
                            { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                                value: [
                                    `Kangel gained **${randomFollower*1.1.toFixed(0)} new followers**!`,
                                    `Kangel earned **¢${randomAmount*1.1.toFixed(0)} in Ad Revenue**!`,
                                    `Kangel's stress went up by **${randomStress*1.2.toFixed(2)}**!`,
                                    `Kangel's affection went down by **${randomAffection*0.3.toFixed(2)}**!`,
                                    `Kangel's mental darkness went up by **${randomMental*1.1.toFixed(2)}**!`
                                ].join("\n"),
                                inline: true
                            },
                        )
        
                        return interaction.reply({embeds: [embed]})
                    }
        
                    if(interaction.options.getString('topic') === "chill") {
                        dailyStreamDB(1, 0.1, 1.2, 1, 1)
                        embed.setTitle("❤️ Chill Stream!")
                        embed.addFields(
                            { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                                value: [
                                    `Kangel gained **${randomFollower*1.00.toFixed(0)} new followers**!`,
                                    `Kangel earned **¢${randomAmount*1.00.toFixed(0)} in Ad Revenue**!`,
                                    `Kangel's stress went up by **${randomStress*1.00.toFixed(2)}**!`,
                                    `Kangel's affection went down by **${randomAffection*0.1.toFixed(2)}**!`,
                                    `Kangel's mental darkness went up by **${randomMental*1.2.toFixed(2)}**!`
                                ].join("\n"),
                                inline: true
                            },
                        )
        
                        return interaction.reply({embeds: [embed]})
                    }
        
                    if(interaction.options.getString('topic') === "scary") {
                        dailyStreamDB(1.4, 0.6, 1.1, 1.4, 1.2)
                        embed.setTitle("👻 Scary Stream!")
                        embed.addFields(
                            { name: `<:heart:1155448985956397078> Kangel completed her daily stream!`,
                                value: [
                                    `Kangel gained **${randomFollower*1.4.toFixed(0)} new followers**!`,
                                    `Kangel earned **¢${randomAmount*1.2.toFixed(0)} in Ad Revenue**!`,
                                    `Kangel's stress went up by **${randomStress*1.4.toFixed(1)}**!`,
                                    `Kangel's affection went down by **${randomAffection*0.6.toFixed(2)}**!`,
                                    `Kangel's mental darkness went up by **${randomMental*1.1.toFixed(2)}**!`
                                ].join("\n"),
                                inline: true
                            },
                        )
        
                        return interaction.reply({embeds: [embed]})
                    }
                } else {
                    return interaction.reply("You need to make Kangel a streaming account first!")
                }
            }
            break;
            case "internet": {
                if(data) {
                    if(data.DailyActivityCount > 0) {
                        checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    } else if (data.DailyActivityCount === 0) {
                        return checkDailies(interaction, interaction.guild.id, interaction.user.id)
                    }
        
                    switch(options.getString("where")) {
                        case "st": {
                            let embed = new EmbedBuilder()
                            .setImage("https://i.imgur.com/kiD9aci.png")
                            .setColor("LuminousVividPink")
                
                            try {
                                await accountSchema.findOneAndUpdate(
                                    {Guild: interaction.guild.id, User: interaction.user.id},
                                    {
                                        $inc: {
                                            DailyActivityCount: -1,
                                            StressStat: +randomStress*1.9,
                                            MentalDarknessStat: +randomMental*0.8,
                                            AffectionStat: -randomAffection*0.3
                                        }
                                    }
                                )
                            } catch(err) {
                                console.log(err);
                            }
                
                            embed.addFields(
                                { name: `/st/`,
                                    value: [
                                        `Kangel's stress went up by **${randomStress*1.9.toFixed(2)}**!`,
                                        `Kangel's mental darkness went up by **${randomMental*0.8.toFixed(2)}**!`,
                                        `Kangel's affection went down by **${randomAffection*0.3.toFixed(2)}**!`,
                                    ].join("\n"),
                                    inline: true
                                },
                            )
        
                            return interaction.reply({embeds: [embed]})
                        }
                        break;
                    }
                } else {
                    return interaction.reply("You need to make Kangel a streaming account first!")
                }
            }
        }
    }
}