const accountSchema = require("../Schemas.js/account")

async function checkDailies(message, guild, user) {
    let data = await accountSchema.findOne({Guild: guild, User: user}).catch(err => {})
    let activityCooldown = 86400000;
    let activityTimeLeft = activityCooldown - (Date.now() - data.LastActivity);

    if(data.DailyActivityCount === 0 || data.DailyActivityCount < 0) {
        if(activityTimeLeft === 0) {     
            try {
                await accountSchema.findOneAndUpdate(
                    {Guild: guild, User: user},
                    {
                        $inc: {
                            DailyActivityCount: +3,
                        }
                    }
                )
            } catch(err) {
                console.log(err);
            }
        } else {
            return message.reply({content: `You've exhausted your daily activities with Kangel! She's asleep as we speak..`, ephemeral: true});
        }
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