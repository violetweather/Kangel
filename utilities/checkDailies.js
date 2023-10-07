const accountSchema = require("../Schemas.js/account")
const parseMs = require("parse-ms-2")

async function checkDailies(message, guild, user) {
    let data = await accountSchema.findOne({Guild: guild, User: user}).catch(err => {})
    let activityCooldown = 86400000;
    let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);

    if(data.DailyActivityCount === 0 || data.DailyActivityCount < 0) {
        const { hours, minutes, seconds } = parseMs(activityTimeLeft);
        return message.reply({content: `You've exhausted your daily activities with Kangel! Claim more using /kangel claim!`, ephemeral: true});
    }

    if(data.DailyActivityCount === 1) {
        try {
            await accountSchema.findOneAndUpdate(
                {Guild: guild, User: user},
                {
                    $set: {
                        LastActivity: Date.now(),
                    }
                }
            )
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = checkDailies;