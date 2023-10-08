const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { loadImage, drawImage, createCanvas, registerFont } = require('canvas')

module.exports = {
    category: "entertainment",
	data: new SlashCommandBuilder()
		.setName('caption')
		.setDescription('Put text over an image of your choice!')
        .addAttachmentOption(option =>
            option.setName("image").setDescription("Upload the image you want to caption.").setRequired(true))
        .addStringOption(option => 
            option.setName("text").setDescription("Input text for caption.")
            .setMaxLength(1)
            .setMaxLength(200)
            .setRequired(true)),
    async execute(interaction) {
        let userAttachment = interaction.options.getAttachment("image")
        let userAttachmentURL = userAttachment.url
        let inputCmdText = interaction.options.getString("text")
        if(!userAttachment.contentType === "image/png" || !userAttachment.contentType === "image/jpeg") {
            return interaction.reply({content: "Invalid media type.", ephemeral: true})
        }

        registerFont("./utilities/impact.ttf", { family: "Impact"});
        let img = await loadImage(userAttachmentURL)
        let canvas = createCanvas(1280, 720)
        let ctx = canvas.getContext('2d');

        // draw image
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1280, 720);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 1280, 100)

        // image properties
        ctx.font = '60px Impact'
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.fillText(`${inputCmdText}`, 90, 90, canvas.width, canvas.height)

        let buffer = canvas.toBuffer();

        // send canvas image
        interaction.reply({files: [new AttachmentBuilder(buffer, 'test.png')]})
    }
}