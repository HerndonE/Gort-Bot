const Discord = require('discord.js');
const bot = new Discord.Client();
var Index = require('../index');
var token = Index.token;
const Sanitize = require("../sanitize");
const request = require('request');
const animalPREFIX = '.';
var animalmessage;
bot.on('message', animalmessage => {

    let raw_userinput = animalmessage.content.substring(animalPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    switch (args[0]) {
        case 'cat':
            var url = "https://aws.random.cat/meow"; //cat api
            request(url, function(err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    console.log('body:', body);
                }
                let parsedData = JSON.parse(body)
                animalmessage.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setColor("0x999999")
                        .setImage(parsedData["file"])
                        .setTimestamp()

                });
            });
            break;
        case 'dog':
            var url = "https://random.dog/woof.json"; //dog api
            request(url, function(err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    console.log('body:', body);
                }
                let parsedData = JSON.parse(body)
                animalmessage.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setColor("0x999999")
                        .setImage(parsedData["url"])
                        .setTimestamp()

                });
            });
            break;
    }
})

bot.on('ready', () => {
    console.log('The furies are on the rise commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy