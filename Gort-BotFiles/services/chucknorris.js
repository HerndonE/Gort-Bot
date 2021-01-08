const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
var chucknorrismessage;
const chuckNorrisPREFIX = '.';


bot.on('message', chucknorrismessage => {
    let raw_userinput = chucknorrismessage.content.substring(chuckNorrisPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    
    switch (args[0]) {
        case 'chucknorris':
       
            //nerdyjokemessage.channel.send("Let the jokes begin!");
             var url = 'http://api.icndb.com/jokes/random?limitTo=[nerdy';
             request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        console.log('body:', body);
                        if (body == '{"total":0,"totalHits":0,"hits":[]}') {
                            //console.log('wow');
                            chucknorrismessage.channel.send("Error! You may have mistyped something. :(")
                            return;
                        }
                    }
                    let parsedData = JSON.parse(body)
                    
                    chucknorrismessage.channel.send({
                    embed: new Discord.MessageEmbed()
                    .setColor("0x999999")
                    .setDescription(parsedData['value']['joke'] + " 😂😅")
                    });
             });
        break;
    }
})

bot.on('ready', () => {
    console.log('Chuck Norris Function is Ready Commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy