const accountSchema = require("../Schemas.js/account")
const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const items = require("../utilities/items.json")

async function gachaPull(message, bannerPick, pullPick) {
    let data = await accountSchema.findOne({Guild: message.guild.id, User: message.user.id}).catch(err => {})

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
        {value: 'two_star', probability: 5},
        {value: 'one_star', probability: 30},
        {value: 'zero_star', probability: 64.5}
    ]);
    
    if(bannerPick === "featured") {     
        let embed = new EmbedBuilder()

        // item randomizer function
        async function pull() {
            let itemRarityRandomizer;

            function randomizerItem(itemRarityRandomizer) {
                const values = Object.values(itemRarityRandomizer)
                const allValues = values[parseInt(Math.random() * values.length)]
                const definedItem = allValues

                return definedItem;
            }

            async function dbPUSH(definedItem) {
                try {
                    await accountSchema.findOneAndUpdate(
                        {Guild: message.guild.id, User: message.user.id},
                        {
                            $inc: {
                                Crystal: -10
                            }
                        }
                    )
                } catch(err) {
                    console.log(err);
                }
    
                try {
                    await accountSchema.findOneAndUpdate({Guild: message.guild.id, User: message.user.id}, { $push: { Items: {
                        ItemDate: Date.now(),
                        ItemRarity: definedItem.rarity,
                        ItemName: definedItem.name,
                        ItemID: definedItem.id,
                        ItemRarityStandard: definedItem.normal_rarity
                    }}})
                } catch(err) {
                    console.log(err);
                }
    
                try {
                    await accountSchema.findOneAndUpdate({Guild: message.guild.id, User: message.user.id}, { $push: { Pulls: {
                        ItemRecordDate: Date.now(),
                        ItemRecordRarity: definedItem.rarity,
                        ItemRecordName: definedItem.name,
                        ItemRecordID: definedItem.id
                    }}})
                } catch(err) {
                    console.log(err);
                }
            }

            if(result === "zero_star") {
                let definedItem = randomizerItem(items.zero_star);
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 0★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "one_star") {
                let definedItem = randomizerItem(items.one_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 1★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "two_star") {
                let definedItem = randomizerItem(items.two_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 2★! \n - ${definedItem.name}`)
                embed.setColor("LuminousVividPink")
                embed.setDescription(definedItem.description)
            }

            if(result === "three_star") {
                let definedItem = randomizerItem(items.three_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 3★! \n - ${definedItem.name}`)
                embed.setColor("Gold")
                embed.setDescription(definedItem.description)
            }
 
            message.channel.send({embeds:[embed]})

            return;
        }

        async function pullMulti() {
            let itemRarityRandomizer;

            function randomizerItem(itemRarityRandomizer) {
                const values = Object.values(itemRarityRandomizer)
                const allValues = values[parseInt(Math.random() * values.length)]
                const definedItem = allValues

                return definedItem;
            }

            async function dbPUSH(definedItem) {
                try {
                    await accountSchema.findOneAndUpdate({Guild: message.guild.id, User: message.user.id}, { $push: { Items: {
                        ItemDate: Date.now(),
                        ItemRarity: definedItem.rarity,
                        ItemName: definedItem.name,
                        ItemID: definedItem.id,
                        ItemRarityStandard: definedItem.normal_rarity
                    }}})
                } catch(err) {
                    console.log(err);
                }
    
                try {
                    await accountSchema.findOneAndUpdate({Guild: message.guild.id, User: message.user.id}, { $push: { Pulls: {
                        ItemRecordDate: Date.now(),
                        ItemRecordRarity: definedItem.rarity,
                        ItemRecordName: definedItem.name,
                        ItemRecordID: definedItem.id
                    }}})
                } catch(err) {
                    console.log(err);
                }
            }

            if(result === "zero_star") {
                let definedItem = randomizerItem(items.zero_star);
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 0★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "one_star") {
                let definedItem = randomizerItem(items.one_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 1★! \n - ${definedItem.name}`)
                embed.setColor("DarkButNotBlack")
                embed.setDescription(definedItem.description)
            }

            if(result === "two_star") {
                let definedItem = randomizerItem(items.two_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 2★! \n - ${definedItem.name}`)
                embed.setColor("LuminousVividPink")
                embed.setDescription(definedItem.description)
            }

            if(result === "three_star") {
                let definedItem = randomizerItem(items.three_star)
                await dbPUSH(definedItem)

                embed.setTitle(`You pulled 3★! \n - ${definedItem.name}`)
                embed.setColor("Gold")
                embed.setDescription(definedItem.description)
            }
 
            message.channel.send({embeds:[embed]})

            return;
        }

        if(pullPick === "one") {
            message.reply({content: "Running one pull...", ephemeral: true})
            await pull();
        }
        if(pullPick === "multi") {
            if(data.Crystal < 80) {
                return message.reply("Multis require at least 80 <:8187:1163707516417486879> Angel Crystals")
            }

            async function call(fn, /* ms */ every, /* int */ times) {
                var repeater = async function () {
                    fn();
                    if (--times) setTimeout(repeater, every);
                };
                repeater(); // start loop
            }

            message.reply({content: "Running 10 pull...", ephemeral: true})

            var i = 0;
            call(function() { pullMulti()}, 2e3, 10);

            try {
                await accountSchema.findOneAndUpdate(
                    {Guild: message.guild.id, User: message.user.id},
                    {
                        $inc: {
                            Crystal: -80
                        }
                    }
                )
            } catch(err) {
                console.log(err);
            }
        }
    }
}

module.exports = gachaPull;