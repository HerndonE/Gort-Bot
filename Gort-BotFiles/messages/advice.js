const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;
const Sanitize = require("../sanitize");
const request = require('request');
const advicePREFIX = '.';
var advicemessage;
bot.on('message', advicemessage => {

    let raw_userinput = advicemessage.content.substring(advicePREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    switch (args[0]) {
        case 'advice':
            var url = "https://api.adviceslip.com/advice"; //advice api
            request(url, function(err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    console.log('body:', body);
                }
                let parsedData = JSON.parse(body)
                advicemessage.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setColor("0x999999")
                        .setDescription(parsedData["slip"]["advice"])
                        .setTimestamp()

                });
            });
            break;
    }
})

bot.on('ready', () => {
    console.log('Im just a bot but I give advice too commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy