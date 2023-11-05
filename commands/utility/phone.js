const cheerio = require("cheerio")
const axios = require("axios")
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');

module.exports = {
    category: "utility",
	data: new SlashCommandBuilder()
		.setName('phone')
		.setDescription('Look phones up through GSMArena')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The phone you would like to search')
                .setRequired(true)),
    async execute(interaction) {
        let phoneInput = interaction.options.getString("input")

        function killHTML(str) {
            if ((str===null) || (str===''))
                return false;
            else
            str = str.toString();
            return str.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, ' ');
        }

        if(phoneInput) {
            try {
                const embeds = [];
                
                for (let i = 0; i <= 4; i++) {
                    let phoneSearchData = [];
                    let phoneDataDetail = [];
                    let phoneDataExtraDetail = [];
                    let quickSpec = [];
            
                    async function phoneSearch() {
                        let url = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${phoneInput}`
                        let res = await axios.get(url)
                        let $ = await cheerio.load(res.data)
            
                        let phones = $(".makers").find("li")
                        phones.each((i, e) => {
                            let device = {
                                name: $(e).find("span").html().split("</br>").join(" "),
                                img: $(e).find("img").attr("src"),
                                url: $(e).find("a").attr("href"),
                                description: $(e).find("img").attr("title")
                            }
                
                            phoneSearchData.push(device)
                        })
                    }
            
                    async function phoneDetail(phone) {
                        let url = `https://www.gsmarena.com/${phone}`
                        let res = await axios.get(url)
                        let $ = await cheerio.load(res.data)
            
                        let display_size = $('span[data-spec=displaysize-hl]').text();
                        let display_res = $('div[data-spec=displayres-hl]').text();
                        let camera_pixels = $('.accent-camera').text();
                        let video_pixels = $('div[data-spec=videopixels-hl]').text();
                        let ram_size = $('.accent-expansion').text();
                        let chipset = $('div[data-spec=chipset-hl]').text();
                        let battery_size = $('.accent-battery').text();
                        let battery_type = $('div[data-spec=battype-hl]').text();
            
                        let quick_spec = {
                            display_size: display_size,
                            display_res: display_res,
                            camera_pixels: camera_pixels,
                            video_pixels: video_pixels,
                            ram_size: ram_size,
                            chipset: chipset,
                            battery_size: battery_size,
                            battery_type: battery_type
                        }
            
                        let title = $('.specs-phone-name-title').text();
                        let img = $('.specs-photo-main a img').attr('src');
                        let img_url = $('.specs-photo-main a').attr('href');
            
                        quickSpec.push(quick_spec)
            
                        let specNode = $('table')
                        specNode.each((i, el) => {
                            let category = $(el).find('th').text();
                            let specN = $(el).find('tr')
                            specN.each((index, ele) => {
                                let a = {
                                    name: $('td.ttl', ele).text(),
                                    value: $('td.nfo', ele).text()
                                }
                                phoneDataDetail.push(a)
                            });
            
                            phoneDataExtraDetail.push({
                                category: category,
                                specs: phoneDataDetail
                            })
                        });
                    }

                    await phoneSearch()

                    await phoneDetail(phoneSearchData[i].url)
                    let phoneBase = phoneSearchData[i]

                    function detail(property) {
                        let d = phoneDataDetail.find(({ name }) => name === `${property}`)
                        if(d) {
                            return d.value
                        } else {
                            return "N/A";
                        }
                    }
    
                    let quickDetail = quickSpec[0] || "N/A"

                    const embed = new EmbedBuilder()
                    embed.setColor("LuminousVividPink")
                    embed.setTitle(killHTML(phoneBase.name))
                    embed.setImage(phoneBase.img)
                    embed.addFields(
                        { name: `ℹ️ Basic Information`,
                            value: [
                                `**Price**: ${detail("Price")}`,
                                `**Announce Date**: ${detail("Announced")}`,
                                `**Status**: ${detail("Status")}`,
                                `**Chipset**: ${detail("Chipset")}`,
                                `**GPU**: ${detail("GPU")}`,
                                `**OS**: ${detail("OS")}`,
                                `**Storage Options and Memory**: ${detail("Internal")}`,
                        ].join("\n"),
                        inline: true
                        }
                    )
                    embed.addFields(
                        { name: `🗒️ Body`,
                            value: [
                                `**Dimensions**: ${detail("Dimensions")}`,
                                `**Weight**: ${killHTML(detail("Weight"))}`,
                                `**Build**: ${detail("Build")}`
                        ].join("\n"),
                        inline: true
                        }
                    )
                    embed.addFields(
                        { name: `📱 Display`,
                            value: [
                                `**Size**: ${detail("Size")}`,
                                `**Resolution**: ${detail("Resolution")}`,
                                `**Type**: ${detail("Type")}`
                        ].join("\n"),
                        inline: true
                        }
                    )
                    embed.addFields(
                        { name: `🔋 Battery`,
                            value: [
                                `**Type**: ${quickDetail.battery_type}`,
                                `**Size**: ${quickDetail.battery_size}`,
                                `**Charging**: ${detail("Charging")}`,
                                `**Expected Life**: ${killHTML(detail("Battery life"))}`,
                        ].join("\n"),
                        inline: true
                        }
                    )
                    embed.addFields(
                        { name: `📷 Camera`,
                            value: [
                                `**Triple**: ${detail("Triple")}`,
                                `**Video**: ${killHTML(detail("Video"))}`,
                                `**Single**: ${detail("Single")}`
                        ].join("\n"),
                        inline: true
                        }
                    )
                    embed.addFields(
                        { name: `⚙️ Misc`,
                            value: [
                                `**Colors**: ${detail("Colors")}`,
                                `**Models**: ${killHTML(detail("Models"))}`,
                        ].join("\n"),
                        inline: true
                        }
                    )

                    embeds.push(embed);
                }

                await pagination({
                    embeds: embeds, /** Array of embeds objects */
                    author: interaction.member.user,
                    interaction: interaction,
                    ephemeral: false,
                    time: 40000, /** 20 seconds */
                    disableButtons: true, /** Remove buttons after timeout */
                    fastSkip: false,
                    pageTravel: false,
                    buttons: [
                        {
                            type: ButtonTypes.previous,
                            label: 'Previous Page',
                            style: ButtonStyles.Primary
                        },
                        {
                            type: ButtonTypes.next,
                            label: 'Next Page',
                            style: ButtonStyles.Success
                        }
                    ]
                });
            }  catch (err) {
                return interaction.reply({content: "An error was encountered while running the command.", ephemeral: true})
            }
        }
    }
}