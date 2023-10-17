const accountSchema = require("../Schemas.js/account")
const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const items = require("../utilities/items.json")

async function gachaPull(message, bannerPick, pullPick) {
    function weightedSample(pairs) {
        const n = Math.random() * 100;
        const match = pairs.find(({value, probability}) => n <= probability);
        return match ? match.value : last(pairs).value;
    }

    function last(array) {
        return array[array.length - 1];
    }
    
    const result = weightedSample([
        {value: 'three_star', probability: 0.5},
        {value: 'two_star', probability: 10},
        {value: 'one_star', probability: 30},
        {value: 'zero_star', probability: 59.5}
    ]);
    
    if(bannerPick === "featured") {     
        let embed = new EmbedBuilder()

        // item randomizer function
        async function pull(itemRarityRandomizer) {
            const values = Object.values(itemRarityRandomizer)
            const allValues = values[parseInt(Math.random() * values.length)]
            const definedItem = allValues

            return definedItem;
        }

        if(pullPick === "one") {
            if(result === "zero_star") {
                let definedItem = await pull(items.zero_star)

                embed.setTitle(`You pulled 0★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "one_star") {
                let definedItem = await pull(items.one_star)

                embed.setTitle(`You pulled 1★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "two_star") {
                let definedItem = await pull(items.two_star)

                embed.setTitle(`You pulled 2★! \n - ${definedItem.name}`)
                embed.setColor("LuminousVividPink")
                embed.setDescription(definedItem.description)
            }

            if(result === "three_star") {
                let definedItem = await pull(items.three_star)

                embed.setTitle(`You pulled 3★! \n - ${definedItem.name}`)
                embed.setColor("Gold")
                embed.setDescription(definedItem.description)
            }

            message.reply({embeds:[embed]})
        }
        if(pullPick === "multi") {
            return message.reply({content: "Not available yet", ephemeral: true})
        }
    }
}

module.exports = gachaPull;