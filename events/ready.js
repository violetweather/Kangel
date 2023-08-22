const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(yukong) {
		console.log(`${yukong.user.tag} is ready.`);
	},
};