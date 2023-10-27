const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { loadImage, drawImage, createCanvas, registerFont, Image } = require('canvas')
const ReviewedUser = require('../../Schemas.js/rateSchema')
const fs = require("fs");

module.exports = {
    category: "utility",
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('See your Kangel profile!'),
    async execute(interaction) {
        let profileURL = "./utilities/images/profileImage.png"
        registerFont("./utilities/fonts/VCR.ttf", { family: "VCR OSD Mono"});
        registerFont("./utilities/fonts/Arame.ttf", { family: "Arame"});
        let img = await loadImage(profileURL)
        let canvas = createCanvas(600, 365)
        let ctx = canvas.getContext('2d');
        let user = await interaction.user.fetch({force:true});
        let iconImgURL = user.displayAvatarURL({ extension: "png" })
        let userIcon = await loadImage(iconImgURL)

        // main image and profile picture
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(userIcon, 433, 200, 130, 130);

        // username and nickname
        ctx.font = '20px VCR OSD Mono'
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(`${user.username}`, 10, 30, canvas.width, canvas.height)

        const reviewUser = await ReviewedUser.findOne({
            UserID: user.id
        })

        if(reviewUser) {
            let userFilterReviews = reviewUser.Ratings.pop();
            let ratingse = 0;
            reviewUser.Ratings.forEach((obj, index) => {
                ratingse = (ratingse + obj.StarRating)
            })

            ratingse = ratingse / reviewUser.Ratings.length;

            if(!isNaN(ratingse)) {
                let avgStarRating = `${ratingse.toFixed(2)}/5.00 ⭐`
                ctx.font = '22px VCR OSD Mono'
                ctx.fillStyle = '#fffbdd';
                ctx.textAlign = 'left';
                ctx.fillText(`${avgStarRating}`, 425, 177, canvas.width, canvas.height)
            }

            ctx.font = '15px Arame'
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText(`"${userFilterReviews.Comment}" \n by @${userFilterReviews.Author}`, 40, 270, canvas.width, canvas.height)
        }

        if(!reviewUser) {
            ctx.font = '15px Arame'
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText(`No reviews for this user..`, 30, 230, canvas.width, canvas.height)
        }

        // Display name
        ctx.font = '30px VCR OSD Mono'
        ctx.fillStyle = '#4819cb';
        ctx.textAlign = 'left';
        ctx.fillText(`${user.globalName.toUpperCase() || user.username.toUpperCase()}`, 50, 125, canvas.width, canvas.height)

        let buffer = canvas.toBuffer();
        // send canvas image
        interaction.reply({files: [new AttachmentBuilder(buffer, 'profile.png')]})
    }
}