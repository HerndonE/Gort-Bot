const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
var planetside2message;
const helper = require("../helpers/helper.js");

bot.on('message', planetside2message => {
   
    let raw_userinput = planetside2message.content.substring(helper.helperVals.botPrefix.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    var text;
    var text2;
    switch (args[0]) {
        case 'ps2':
         const input = args.join(" ");
            console.log(input);
            
            if (input == null || !isNaN(input)) {
                planetside2message.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            } 
            else
            {
               text = input.replace("ps2 ", "");
                console.log(text);
                if(text.includes('about')){
                 planetside2message.channel.send({
            embed: new Discord.MessageEmbed()
            .setTitle("Planetside 2 Commands")
            .setThumbnail("https://upload.wikimedia.org/wikipedia/en/thumb/5/58/PlanetSide_2_Cover_Art.png/220px-PlanetSide_2_Cover_Art.png")
            .setColor("0x999999")
            .setDescription("1. _.ps2 player YOURNAMEHERE_" + "\n" +
            "More coming soon.")
            .setTimestamp()
	        .setFooter("PlanetSide 2")
            });
                }
                 if(text.includes('player')){
                    text = text.replace("player ", "").toLocaleLowerCase();
                     var url = "http://census.daybreakgames.com/get/ps2:v2/character/?name.first_lower="+ text;
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
                            helper.sendMessageAboutAPI(planetside2message);
                            helper.helperVals.sendMessageToCreator = true;
                        }
                        return;
                    } else {
                        //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                    }
                    let parsedData = JSON.parse(body)
                    
                    if (parsedData["returned"] == 0){
                         planetside2message.channel.send("You may have mistyped something.")
                        return;
                    }
                  var timePlayed = parsedData["character_list"][0]["times"]["minutes_played"]
                  if(timePlayed <= 60){
                      timePlayed = "NEED TO PLAY MORE NOOB!";
                  }
                  else{
                     timePlayed = timeConvert(timePlayed);
                  }
                  var factionName = parsedData["character_list"][0]["faction_id"];
                  var color,faction;
                  if(factionName== 1){
                      factionName = 'Vanu Sovereignty';
                      color = "0x990099";
                      faction = "http://census.daybreakgames.com/files/ps2/images/static/94.png";
                      
                  }
                  else if(factionName== 2){
                      factionName = 'New Conglomerate';
                      color = "0x002699";
                       faction = "http://census.daybreakgames.com/files/ps2/images/static/12.png";
                  }
                  else if (factionName == 3){
                      factionName = 'Terran Republic';
                      color = "0x990000";
                       faction = "http://census.daybreakgames.com/files/ps2/images/static/18.png";
                  }
                  else {
                      factionName = 'NS Operatives';
                      color = "0x999999";
                       faction = "NA";
                  }
                    
                    planetside2message.channel.send({
                        embed: new Discord.MessageEmbed()
                        .setTitle("Planetside 2 Player Lookup!\n ~ Gort Bot")
                        .setThumbnail(faction)
                        .setColor(color)
                        .setDescription(
`
**Name:** ${parsedData["character_list"][0]["name"]["first"]}
**Faction:** ${factionName}
**Date Created:** ${parsedData["character_list"][0]["times"]["creation_date"]}
**Last Logined:** ${parsedData["character_list"][0]["times"]["last_login_date"]}
**Time Played:** ${timePlayed}
**Certs Earned:** ${parsedData["character_list"][0]["certs"]["earned_points"]}
**Certs Spent:** ${parsedData["character_list"][0]["certs"]["spent_points"]}
**Battle Rank:** ${parsedData["character_list"][0]["battle_rank"]["value"]}
**% to next rank:** ${parsedData["character_list"][0]["battle_rank"]["percent_to_next"]}
**Character ID:** ${parsedData["character_list"][0]["character_id"]}
`)
                        .setTimestamp()
                         .setImage('https://upload.wikimedia.org/wikipedia/en/5/58/PlanetSide_2_Cover_Art.png?size=20')
	                    .setFooter('By http://census.daybreakgames.com')
  
                    });
             });
                }
                
            }
        break;
    }
})

bot.on('ready', () => {
    console.log('Enemy Medic is the area Commander');
})


bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy

function timeConvert(n) { //Reference: https://www.w3resource.com
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return rhours + " hours and " + rminutes + " minutes.";
}


/*
// Create WebSocket connection. Will need to look on this later.
                    var WebSocket = require('ws')
                    const socket = new WebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=s:453746531');

                    // Connection opened
                    socket.addEventListener('open', function (event) {
                    socket.send('{"service":"event","action":"subscribe","worlds":["1"],"eventNames":["ContinentUnlock"]}');
                    });

                    // Listen for messages
                    socket.addEventListener('message', function (event) {
                     console.log('Message from server ', event.data);
                    });
*/