const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODB_URL;
const logger = require('../logger');
const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor');
const axios = setupCache(Axios)

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(kangel) {
		kangel.user.setActivity({
			name: "♡ with you!",
			type: ActivityType.Streaming,
			url: "https://www.youtube.com/watch?v=6araOMWo4tc"
		})
		if (mongodbURL) {
			await mongoose.connect(mongodbURL || '', {
				keepAlive: true,
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
		}

		if (mongoose.connect) {
			logger.info("MongoDB is running.")
		}
	},
};