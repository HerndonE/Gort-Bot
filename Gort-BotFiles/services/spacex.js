const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
var spacexmessage;
const spaceXPREFIX = '.';

//https://github.com/r-spacex/SpaceX-API/blob/master/docs/v4/README.md

/*
SpaceX List
*/

const cmdSpacex = {
    color: 0x999999,
    title: 'SpaceX List',
    fields: [{
            name: '**1. Lastest Launches**',
            value: '_.spacex launch latest_',
            inline: true,
        },
        {
            name: '**2. Next Launches**',
            value: '_.spacex launch next_',
            inline: true,
        },
        {
            name: '**3. SpaceX Company**',
            value: '_.spacex company_',
            inline: true,
        },

    ],
};

bot.on('message', spacexmessage => {
    let raw_userinput = spacexmessage.content.substring(spaceXPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");

    switch (args[0]) {
        case 'spacex':
            const input = args.join(" ");
            //console.log(input);
            
            if (args[1].includes("about")) {
                spacexmessage.channel.send({
                    embed: cmdSpacex
                });
                //console.log("1: " + args[1]);
            }
            if (args[1].includes("launch")) {
                var text = input.replace("spacex launch ", "");
                //console.log("text:" + text);

                if (text.includes('latest')) {
                    //spacexmessage.channel.send("cool");
                    var url = 'https://api.spacexdata.com/v4/launches/latest';
                    request(url, function(err, response, body) {
                        if (err) {
                            console.log('error:', err);
                        } else {
                            //console.log('body:', body);
                        }
                        let parsedData = JSON.parse(body)

                        spacexmessage.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setColor("0x999999")
                                .setThumbnail(parsedData["links"]["patch"]["large"])
                                .setDescription(
                                    "**Flight Number:** " + parsedData["flight_number"] + '\n' +
                                    "**Name:** " + parsedData["name"] + '\n' +
                                    "**Local Date:** " + parsedData["date_local"] + '\n' +
                                    "**Landing Attempt:** " + parsedData["cores"][0]["landing_attempt"] + '\n' +
                                    "**Landing Success:** " + parsedData["cores"][0]["landing_success"] + '\n' +
                                    "**Webcast:** " + parsedData["links"]["webcast"] + '\n' +
                                    "**Wikipedia:** " + parsedData["links"]["wikipedia"] + '\n' +
                                    "**Campaign:** " + parsedData["links"]["reddit"]["campaign"] + '\n' +
                                    "**Launch:** " + parsedData["links"]["reddit"]["launch"] + '\n' +
                                    "**Recovery:** " + parsedData["links"]["reddit"]["recovery"] + '\n' +
                                    "**Description:** " + parsedData["details"])
                                .setImage(parsedData["links"]["flickr"]["original"][0])
                                .setFooter("By api.spacexdata.com")
                        });
                    });
                }
                if (text.includes('next')) {
                    //spacexmessage.channel.send("cool");
                    var url = 'https://api.spacexdata.com/v4/launches/next';
                    request(url, function(err, response, body) {
                        if (err) {
                            console.log('error:', err);
                        } else {
                            //console.log('body:', body);
                        }
                        let parsedData = JSON.parse(body)

                        spacexmessage.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setColor("0x999999")
                                .setThumbnail(parsedData["links"]["patch"]["large"])
                                .setDescription(
                                    "**Flight Number:** " + parsedData["flight_number"] + '\n' +
                                    "**Name:** " + parsedData["name"] + '\n' +
                                    "**Local Date:** " + parsedData["date_local"] + '\n' +
                                    "**Landing Attempt:** " + parsedData["cores"][0]["landing_attempt"] + '\n' +
                                    "**Landing Success:** " + parsedData["cores"][0]["landing_success"] + '\n' +
                                    "**Webcast:** " + parsedData["links"]["webcast"] + '\n' +
                                    "**Wikipedia:** " + parsedData["links"]["wikipedia"] + '\n' +
                                    "**Campaign:** " + parsedData["links"]["reddit"]["campaign"] + '\n' +
                                    "**Launch:** " + parsedData["links"]["reddit"]["launch"] + '\n' +
                                    "**Recovery:** " + parsedData["links"]["reddit"]["recovery"] + '\n' +
                                    "**Description:** " + parsedData["details"])
                                .setImage()
                                .setFooter("By api.spacexdata.com")
                        });
                    });
                }

            }
            if (args[1].includes("company")) {
                var url = 'https://api.spacexdata.com/v4/company';
                request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        //console.log('body:', body);
                    }
                    let parsedData = JSON.parse(body)

                    spacexmessage.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription(
                                "**Name: **" + parsedData["name"] + '\n' +
                                "**Founder: **" + parsedData["founder"] + '\n' +
                                "**Founded: **" + parsedData["founded"] + '\n' +
                                "**Employees: **" + parsedData["employees"] + '\n' +
                                "**Vehicles: **" + parsedData["vehicles"] + '\n' +
                                "**Launch Sites: **" + parsedData["launch_sites"] + '\n' +
                                "**Test Sites: **" + parsedData["test_sites"] + '\n' +
                                "**CEO: **" + parsedData["ceo"] + '\n' +
                                "**CTO: **" + parsedData["cto"] + '\n' +
                                "**COO: **" + parsedData["coo"] + '\n' +
                                "**CTO Propulsion: **" + parsedData["cto_propulsion"] + '\n' +
                                "**Summary: **" + parsedData["summary"] + '\n' +
                                "**Headquarters: **" + parsedData["headquarters"]["address"] + "," +
                                parsedData["headquarters"]["city"] + "," +
                                parsedData["headquarters"]["state"] + '\n' +
                                "**Website: **" + parsedData["links"]["website"] + '\n' +
                                "**Flickr: **" + parsedData["links"]["flickr"] + '\n' +
                                "**Twitter: **" + parsedData["links"]["twitter"] + '\n' +
                                "**Elons Twitter: **" + parsedData["links"]["elon_twitter"]
                            )
                            .setImage()
                            .setFooter("By api.spacexdata.com")
                    });
                });
            } 
             if(!args[1].includes("about") && !args[1].includes("company") &&  !args[1].includes("launch") ){
                spacexmessage.channel.send("You may have mistyped something.")
              return;  
            }
         
            break;
    }
})

bot.on('ready', () => {
    console.log('Elon Musk is Ready Commander');
})

bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy