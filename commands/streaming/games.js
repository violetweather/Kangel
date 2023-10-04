const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { Slots, Wordle, Minesweeper, FastType } = require('discord-gamecord');
const accountSchema = require("../../Schemas.js/account")
const typingSentencesFile = require("../../utilities/typingSentences.json")

module.exports = {
	category: 'streaming',
	data: new SlashCommandBuilder()
		.setName('games')
		.setDescription('Play games with Kangel, must have started your journey with Kangel!')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('slots')
                .setDescription('Play a game of slots with Kangel!')
				.addStringOption(option => 
					option.setName('gamble')
					.setDescription('Enter your gamble amount').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('wordle')
				.setDescription('Play wordle with Kangel!')
				.addStringOption(option => 
					option.setName('gamble')
					.setDescription('Enter your gamble amount').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('minesweeper')
				.setDescription('Play minesweeper with Kangel!')
				.addStringOption(option => 
					option.setName('gamble')
					.setDescription('Enter your gamble amount').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('typing')
				.setDescription('Make angel spam her keyboard to win')
				.addStringOption(option => 
						option.setName('gamble')
						.setDescription('Enter your gamble amount').setRequired(true))),
	async execute(interaction) {
		const valuesTyping = Object.values(typingSentencesFile)
        const typingSentences = valuesTyping[parseInt(Math.random() * valuesTyping.length)]

		const { options, user, guild } = interaction;
		let data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err => {})
		const value = options.getString("gamble")

		if(!data) return interaction.reply({content: "Kangel doesn't have a streamer account.", ephemeral: true}) 
		if(data.Wallet === 0) return interaction.reply({content: "Kangel is broke. No money for her to gamble away.", ephemeral: true})
		const converted = Number(value)
		if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
		if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})
		if(value < 0) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})

		// async function gambleALL() {
		// 	let allNumber = data.Wallet - data.Wallet
		// 	await accountSchema.findOneAndUpdate(
		// 		{Guild: interaction.guild.id, User: interaction.user.id},
		// 		{
		// 			$inc: {
		// 				Wallet: allNumber
		// 			}
		// 		}
		// 	)
		// 	return;
		// }

		async function gambleLoss() {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: interaction.user.id},
				{
					$inc: {
						Wallet: - value
					}
				}
			)
			return;
		}

		async function gambleWin() {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: interaction.user.id},
				{
					$inc: {
						Wallet: + value
					}
				}
			)
			return;
		}

		async function noGame(player, player2) {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: interaction.user.id},
				{
					$inc: {
						Wallet: - value
					}
				}
			)
			return;
		}

		async function TTTLoss(player, player2) {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: player},
				{
					$inc: {
						Wallet: - value
					}
				}
			)

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: player2},
				{
					$inc: {
						Wallet: - value
					}
				}
			)
			return;
		}

		async function TTTWin(player) {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: player},
				{
					$inc: {
						Wallet: + value
					}
				}
			)

			await accountSchema.findOneAndUpdate(
				{Guild: interaction.guild.id, User: player},
				{
					$inc: {
						Wallet: - value
					}
				}
			)
		}

		switch(options.getSubcommand()) {
			case "slots": {
				const Game = new Slots({
					message: interaction,
					isSlashGame: true,
					embed: {
					  title: 'Slot Machine',
					  color: '#5865F2'
					},
					slots: ['🍇', '🍊', '🍋', '🍌']
				});

				Game.startGame()
				Game.on('gameOver', result => {
					if(result.result === "lose") {
						return gambleLoss()
					}

					if(result.result === "win") {
						return gambleWin()
					}
				});
			}
			break;
			case "wordle": {
				const Game = new Wordle({
					message: interaction,
					isSlashGame: true,
					embed: {
					  title: 'Wordle',
					  color: '#5865F2',
					},
					customWord: null,
					timeoutTime: 60000,
					winMessage: `You won **¢${converted}**! The word was **{word}**`,
					loseMessage: `You lost **¢${converted}**! The word was **{word}**.`,
					playerOnlyMessage: 'Only {player} can use these buttons.'
				});

				Game.startGame();
				Game.on('gameOver', result => {
					if(result.result === "lose") {
						return gambleLoss()
					}

					if(result.result === "win") {
						return gambleWin()
					}
				});
			}
			break;
			case "minesweeper": {
				const Game = new Minesweeper({
					message: interaction,
					isSlashGame: true,
					embed: {
					  title: 'Minesweeper',
					  color: '#F3CFC6',
					  description: 'Click on the buttons to reveal the blocks.'
					},
					emojis: { flag: '🚩', mine: '💣' },
					mines: 5,
					timeoutTime: 60000,
					winMessage: `Kangel won the game! She wins **¢${converted}**`,
					loseMessage: `Kangel lost.. **¢${converted}**`,
					playerOnlyMessage: 'Only {player} can use these buttons.'
				});
				  
				Game.startGame();
				Game.on('gameOver', result => {
					if(result.result === "lose") {
						return gambleLoss()
					}

					if(result.result === "win") {
						return gambleWin()
					}
				});
			}
			break;
			case "typing": {
				const Game = new FastType({
					message: interaction,
					isSlashGame: true,
					embed: {
					  title: 'Fast Type',
					  color: '#F3CFC6',
					  description: 'You have **{time}** seconds to type the sentence below.'
					},
					timeoutTime: 5000,
					sentence: typingSentences,
					winMessage: `Kangel won **¢${converted}**! Kangel finished the type race in **{time}** seconds with wpm of **{wpm}**.`,
					loseMessage: `Kangel lost **¢${converted}**! Kangel didn\'t type the correct sentence in time.`,
				});
				  
				Game.startGame();
				Game.on('gameOver', result => {
					if(result.result === "lose") {
						return gambleLoss()
					}

					if(result.result === "win") {
						return gambleWin()
					}
				});
			}
		}
    }
}