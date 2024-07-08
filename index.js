require('dotenv').config();

const axios = require('axios');

//IMPORT ITEMS WE NEED FROM DISCORD.JS
const { Client, GatewayIntentBits } = require('discord.js');

//CONFIGURE WHAT EVENTS THE DISCORD BOT IS ABLE TO RECEIVE
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
	console.log('bot is ready');
})

function removeLineBreaks(str) {
  return str.split(/\r?\n|\r/).join('');
}

function preprocessInput(str) {
	//remove all line breaks
	const splitString = str.split(/\r?\n|\r/).join('');
	//remove text from the beginning of the string and focus on the colored emojis
	//THIS ONLY WORKS WHEN THE CONNECTIONS NUMBER IS 3 DIGITS, ONCE THEY REACH 1000 THIS WILL NOT WORK, REPLACE EVENTUALLY WITH A BETTER DETECTION METHOD
	return splitString.substring(23);
}

client.on('messageCreate', async (message) => {
	if (message.content.startsWith('Connections')) {

		const emojiResults = preprocessInput(message.content);
		const answerArray = [];
		var answerAttempts = 0;
		
		//set up an array for the answers, each containing an array of four entries
		for(i=0; i<emojiResults.length/8; i++) {
			let currentAnswer = [];
			for(j=0; j<4; j++) {
				currentAnswer[j] = emojiResults.charCodeAt((j*2)+(i*8)+1)
			}
			answerArray[i] = currentAnswer
			answerAttempts += 1;
		}

		const mistakesMade = answerAttempts-4;

		if (mistakesMade === 1) {
			message.reply({
				content: `You made ${mistakesMade} mistake today!`,	
			})
		} else {
			message.reply({
				content: `You made ${mistakesMade} mistakes today!`,	
			})
		}

		console.log(answerArray);

		//go through the answerArray and find which color was correctly guessed first

		function identifyFirstCorrect(answerArray) {
			for(i=0; i<answerArray.length; i++) {
				const currentArray = answerArray[i]
				const firstValue = currentArray[0]
				if (currentArray.every(value => value === firstValue)) {
					return firstValue; //when you find an answer with all identical entries, this is your first answer correctly guessed
				}
			}
		}

		function identifyColor(colorCode) {
			var color = "";

			switch (colorCode) {
				case 57318:
					color = "Blue";
					break;
				case 57320:
					color = "Yellow";
					break;
				case 57321:
					color = "Green";
					break;
				case 57322:
					color = "Purple";
					break;
			}

			return color;
		}

		const firstCorrectGuess = identifyFirstCorrect(answerArray);

		message.reply ({
			content: `The first correctly guessed color was: ${identifyColor(firstCorrectGuess)}!`
		})

		//UNICODE EXPLANATION: each square color emoji seem to take up two spaces, when it comes to the length of the string
		//the first charCodeAt() value for each emoji actually defines it, the second charCodeAt() value for each emoji is always "55357"
		//the first charCodeAt() values are as follows for each color:
		// blue: 57318
		// yellow: 57320
		// green: 57321
		// purple: 57322
		//returns NaN when there is no emoji at the given interval
	}
	
})

client.login(process.env.DISCORD_BOT_ID);



//run node index.js to start the bot
//to keep this bot running continuously, eventually it will be connected to heroku, so that you can consistently make calls to it
