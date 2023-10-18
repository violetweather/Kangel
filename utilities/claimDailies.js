const accountSchema = require("../Schemas.js/account")
const parseMs = require("parse-ms-2")

async function claimDailies(message, guild, user) {
    let data = await accountSchema.findOne({Guild: guild, User: user}).catch(err => {})
    let activityCooldown = 86400000;
    let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);

    if(activityTimeLeft < 0) {
        try {
            await accountSchema.findOneAndUpdate(
                {Guild: guild, User: user},
                {
                    $set: {
                        DailyActivityCount: 10
                    }
                }
            )

            return message.reply({content: `Kangel had good sleep! **[+10 daily activities]**`})
        } catch(err) {
            console.log(err);
        }
    } else {
        const { hours, minutes, seconds } = parseMs(activityTimeLeft);
        return message.reply({content: `You've already claimed your dailies for today! Check back in ${hours} hours ${minutes} minutes ${seconds} seconds`, ephemeral: true});
    }
}

module.exports = claimDailies;