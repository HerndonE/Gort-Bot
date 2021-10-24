const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;
const Sanitize = require("../sanitize");
const request = require('request');
var animalmessage;
const helper = require("../helpers/helper.js");
bot.on('message', animalmessage => {

    let raw_userinput = animalmessage.content.substring(helper.helperVals.botPrefix.length)
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
                if (response.statusCode >= 400) {
                    console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                    if (helper.helperVals.sendMessageToCreator == false) {
                        bot.users.cache.get(`${helper.helperVals.USERID}`).send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                            "It is imperative that this situation gets resolved");
                        helper.sendMessageAboutAPI(animalmessage);
                        helper.helperVals.sendMessageToCreator = true;
                    }
                    return;
                } else {
                    //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
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
                if (response.statusCode >= 400) {
                    console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                    if (helper.helperVals.sendMessageToCreator == false) {
                        bot.users.cache.get(`${helper.helperVals.USERID}`).send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                            "It is imperative that this situation gets resolved");
                        helper.sendMessageAboutAPI(animalmessage);
                        helper.helperVals.sendMessageToCreator = true;
                    }
                    return;
                } else {
                    //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
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

bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy