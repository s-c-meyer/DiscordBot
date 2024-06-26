require('dotenv').config();

const axios = require('axios');

//IMPORT ITEMS WE NEED FROM DISCORD.JS
const { Client, GatewayIntentBits } = require('discord.js');

//CONFIGURE WHAT EVENTS THE DISCORD BOT IS ABLE TO RECEIVE
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
	console.log('bot is ready');
})

client.on('messageCreate', async (message) => {
	if (message.content === 'ping') {
		message.reply({
			content: 'pong',
		})
	}
})

client.login(process.env.DISCORD_BOT_ID);



//run node index.js to start the bot
//to keep this bot running continuously, eventually it will be connected to heroku, so that you can consistently make calls to it