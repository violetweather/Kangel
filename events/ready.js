const { Events } = require('discord.js');
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODB_URL;
const logger = require('../logger');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(kangel) {
		console.log(`${kangel.user.tag} is ready.`);

		if (mongodbURL) {
			await mongoose.connect(mongodbURL || '', {
				keepAlive: true,
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
		}

		if (mongoose.connect) {
			logger.info("Database is running.")
		}
	},
};