const accountSchema = require("../Schemas.js/account")
const parseMs = require("parse-ms-2")

async function checkDailies(message, user, activityPoints) {
    let data = await accountSchema.findOne({ User: user}).catch(err => {})
    let activityCooldown = 86400000;
    let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);

    if(data.DailyActivityCount === 0) {
        const { hours, minutes, seconds } = parseMs(activityTimeLeft);
        return message.reply({content: `You've exhausted your daily activities with Kangel! Claim more using /kangel claim!`, ephemeral: true});
    }

    if(data.DailyActivityCount+activityPoints < 0) {
        return message.reply({content: "You don't have enough points for this activity!", ephemeral: true})
    }
}

module.exports = checkDailies;