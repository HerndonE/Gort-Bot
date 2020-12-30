const Discord = require('discord.js');
const bot = new Discord.Client();
var Index = require('../index');
var token = Index.token;

bot.on('message', msg => {

    if ((msg.content === "Good Morning") || (msg.content === "gm") || (msg.content === "morning") ||
        (msg.content === "good morning")) {
        msg.reply(" Good Morning Friend!");
    }

    if ((msg.content === "Good Night") || (msg.content === "gn") || (msg.content === "night") ||
        (msg.content === "good night")) {
        msg.reply(" Good Night Friend!");
    }

    if ((msg.content === "Good Afternoon") || (msg.content === "ga") || (msg.content === "afternoon") ||
        (msg.content === "good afternoon")) {
        msg.reply(" Good Afternoon Friend!");
    }

})

bot.on('ready', () => {
    console.log('Messages are ready commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy