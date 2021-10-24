/**
 * Name: Ethan Herndon
 * Filename: advice.js
 * Description: The .js file uses an api to give advice to the user.
 * API: https://api.adviceslip.com/advice 
*/
const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;
const Sanitize = require("../sanitize");
const request = require('request');
var advicemessage;
const helper = require("../helpers/helper.js");

bot.on('message', advicemessage => {

    let raw_userinput = advicemessage.content.substring(helper.helperVals.botPrefix.length)
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
                if (response.statusCode >= 400) {
                    console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                    if (helper.helperVals.sendMessageToCreator == false) {
                        bot.users.cache.get(`${helper.helperVals.USERID}`).send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                            "It is imperative that this situation gets resolved");
                        helper.sendMessageAboutAPI(advicemessage);
                        helper.helperVals.sendMessageToCreator = true;
                    }
                    return;
                } else {
                    //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
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