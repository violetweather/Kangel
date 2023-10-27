const { SlashCommandBuilder, EmbedBuilder, Client, italic, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { Slots, Wordle, Minesweeper, FastType } = require('discord-gamecord');
const accountSchema = require("../../Schemas.js/account")
const sentences = require("../../utilities/kangel/typingSentences.json")

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
					.setDescription('Enter your gamble amount, you can only gamble up to 500 coins!').setRequired(true)))
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
                    option.setName('difficulty')
                        .setDescription('Easy: 15s, 50 coins! Medium: 10s, 100 coins! Hard: 5s, 500 coins!')
                        .setRequired(true)
                        .addChoices(
                            {name: 'Hard', value: 'hard'},
                            {name: 'Medium', value: 'medium'},
							{name: "Easy", value: "easy"}
                        ))
				.addStringOption(option => 
						option.setName('gamble')
						.setDescription('Enter your gamble amount').setRequired(true))),
	async execute(interaction) {
		const { options, user, guild } = interaction;
		let data = await accountSchema.findOne({User: user.id}).catch(err => {})
		const value = options.getString("gamble")

		if(!data) return interaction.reply({content: "Kangel doesn't have a streamer account.", ephemeral: true}) 
		const converted = Number(value)
		if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
		if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})
		if(value < 0) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})

		async function gambleLoss() {
			const converted = Number(value)
            if(isNaN(converted) === true) return interaction.reply({content: "The amount inputted isn't a number, silly", ephemeral: true})
			if(data.Wallet < parseInt(converted) || converted === Infinity) return interaction.reply({content: "Kangel doesn't have money in her wallet, should probably make Kangel stream or something", ephemeral: true})

			await accountSchema.findOneAndUpdate(
				{User: interaction.user.id},
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
				{User: interaction.user.id},
				{
					$inc: {
						Wallet: + value
					}
				}
			)
			return;
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
				if(converted > 500) {
					return interaction.reply({content: "You can only gamble up to 500 coins on this game!", ephemeral: true})
				}

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
					playerOnlyMessage: 'Only {player} can use these buttons.',
				});

				Game.startGame();

				Game.on('gameOver', result => {
					if(result.result === "lose") {
						return gambleLoss();
					}

					if(result.result === "win") {
						return gambleWin();
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

				let diff = interaction.options.getString("difficulty")
				let difficultySetting = sentences[`${diff}`][Math.floor(Math.random() * sentences[`${diff}`].length)];

				if(diff === "hard") {
					if(converted > 500) {
						return interaction.reply({content: "The betting max is 500 coins for the hard difficulty!", ephemeral: true})
					}

					const Game = new FastType({
						message: interaction,
						isSlashGame: true,
						embed: {
						  title: 'Fast Type',
						  color: '#F3CFC6',
						  description: 'You have **{time}** seconds to type the sentence below.'
						},
						timeoutTime: 5000,
						sentence: difficultySetting,
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

				if(diff === "medium") {

					if(converted > 100) {
						return interaction.reply({content: "The betting max is 100 coins for the medium difficulty!", ephemeral: true})
					}

					const Game = new FastType({
						message: interaction,
						isSlashGame: true,
						embed: {
						  title: 'Fast Type',
						  color: '#F3CFC6',
						  description: 'You have **{time}** seconds to type the sentence below.'
						},
						timeoutTime: 10000,
						sentence: difficultySetting,
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

				if(diff === "easy") {

					if(converted > 50) {
						return interaction.reply({content: "The betting max is 50 coins for the easy difficulty!", ephemeral: true})
					}

					const Game = new FastType({
						message: interaction,
						isSlashGame: true,
						embed: {
						  title: 'Fast Type',
						  color: '#F3CFC6',
						  description: 'You have **{time}** seconds to type the sentence below.'
						},
						timeoutTime: 15000,
						sentence: difficultySetting,
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
}