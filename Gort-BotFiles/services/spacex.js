/**
 * Name: Ethan Herndon
 * Filename: spacex.js
 * Description: The .js file uses an api to inform the user of SpaceX and their activities.
 * API: https://github.com/r-spacex/SpaceX-API
*/
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
const { navDisbut } = require('../index');
const console = require('console');

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
                        let webcastMessage,wikipediaMessage,launchMessage,campaignMessage,recoveryMessage;
                        let errorMessage = 'https://bit.ly/37sVqne'; //Atlassian 404 error
                        if(parsedData["links"]["webcast"] == null){
                            webcastMessage = errorMessage;
                        }
                        else webcastMessage = parsedData["links"]["webcast"];
                        if(parsedData["links"]["wikipedia"] == null){
                            wikipediaMessage = errorMessage;
                        }
                        else wikipediaMessage = parsedData["links"]["wikipedia"];
                        if(parsedData["links"]["reddit"]["launch"]== null){
                            launchMessage = errorMessage;
                        }
                        else launchMessage = parsedData["links"]["reddit"]["launch"];
                        if(parsedData["links"]["reddit"]["campaign"] == null){
                            campaignMessage = errorMessage;
                        }
                        else campaignMessage = parsedData["links"]["reddit"]["campaign"];
                        if(parsedData["links"]["reddit"]["recovery"] == null){
                            recoveryMessage = errorMessage;
                        }
                        else  recoveryMessage = parsedData["links"]["reddit"]["recovery"];
                        let spacexWebcastButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Webcast') 
                        .setID('click_to_function') 
                        .setURL(`${webcastMessage}`)
                        let spacexWikipediaButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Wikipedia') 
                        .setID('click_to_function') 
                        .setURL(`${wikipediaMessage}`)
                        let spacexLaunchButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Launch') 
                        .setID('click_to_function') 
                        .setURL(`${launchMessage}`)
                        let spacexCampaignButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Campaign') 
                        .setID('click_to_function') 
                        .setURL(`${campaignMessage}`)
                        let spacexRecoveryButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Recovery') 
                        .setID('click_to_function') 
                        .setURL(`${recoveryMessage}`)
                        let spacexlatestembed = new Discord.MessageEmbed()
                        .setColor("0x999999")
                        .setThumbnail(parsedData["links"]["patch"]["large"])
                        .setDescription(
                            "**Flight Number:** " + parsedData["flight_number"] + '\n' +
                            "**Name:** " + parsedData["name"] + '\n' +
                            "**Local Date:** " + parsedData["date_local"] + '\n' +
                            "**Landing Attempt:** " + parsedData["cores"][0]["landing_attempt"] + '\n' +
                            "**Landing Success:** " + parsedData["cores"][0]["landing_success"] + '\n' +
                            "**Description:** " + parsedData["details"])
                        .setImage(parsedData["links"]["flickr"]["original"][0])
                        .setFooter("By api.spacexdata.com")
                        spacexmessage.channel.send({buttons:[spacexWebcastButton,spacexWikipediaButton,spacexLaunchButton,spacexCampaignButton,spacexRecoveryButton],
                            embed: spacexlatestembed
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
                        
                        let webcastMessage,wikipediaMessage,launchMessage,campaignMessage,recoveryMessage;
                        let errorMessage = 'https://bit.ly/37sVqne'; //Atlassian 404 error
                        if(parsedData["links"]["webcast"] == null){
                            webcastMessage = errorMessage;
                        }
                        else webcastMessage = parsedData["links"]["webcast"];
                        if(parsedData["links"]["wikipedia"] == null){
                            wikipediaMessage = errorMessage;
                        }
                        else wikipediaMessage = parsedData["links"]["wikipedia"];
                        if(parsedData["links"]["reddit"]["launch"]== null){
                            launchMessage = errorMessage;
                        }
                        else launchMessage = parsedData["links"]["reddit"]["launch"];
                        if(parsedData["links"]["reddit"]["campaign"] == null){
                            campaignMessage = errorMessage;
                        }
                        else campaignMessage = parsedData["links"]["reddit"]["campaign"];
                        if(parsedData["links"]["reddit"]["recovery"] == null){
                            recoveryMessage = errorMessage;
                        }
                        else  recoveryMessage = parsedData["links"]["reddit"]["recovery"];
                        let spacexWebcastButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Webcast') 
                        .setID('click_to_function') 
                        .setURL(`${webcastMessage}`)
                        let spacexWikipediaButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Wikipedia') 
                        .setID('click_to_function') 
                        .setURL(`${wikipediaMessage}`)
                        let spacexLaunchButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Launch') 
                        .setID('click_to_function') 
                        .setURL(`${launchMessage}`)
                        let spacexCampaignButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Campaign') 
                        .setID('click_to_function') 
                        .setURL(`${campaignMessage}`)
                        let spacexRecoveryButton = new navDisbut.MessageButton()
                        .setStyle('url')
                        .setLabel('Recovery') 
                        .setID('click_to_function') 
                        .setURL(`${recoveryMessage}`)

                        let spacexnextembed = new Discord.MessageEmbed()
                        .setColor("0x999999")
                        .setThumbnail(parsedData["links"]["patch"]["large"])
                        .setDescription(
                            "**Flight Number:** " + parsedData["flight_number"] + '\n' +
                            "**Name:** " + parsedData["name"] + '\n' +
                            "**Local Date:** " + parsedData["date_local"] + '\n' +
                            "**Landing Attempt:** " + parsedData["cores"][0]["landing_attempt"] + '\n' +
                            "**Landing Success:** " + parsedData["cores"][0]["landing_success"] + '\n' +
                            "**Description:** " + parsedData["details"])
                        .setImage()
                        .setFooter("By api.spacexdata.com")

                        spacexmessage.channel.send({buttons: [spacexWebcastButton,spacexWikipediaButton,spacexLaunchButton,spacexCampaignButton,spacexRecoveryButton],
                            embed: spacexnextembed
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
                    let websiteMessage,flickrMessage,twitterMessage,twitterElonMessage;
                    let errorMessage = 'https://bit.ly/37sVqne'; //Atlassian 404 error
                    if(parsedData["links"]["website"] == null){
                        websiteMessage = errorMessage;
                    }else websiteMessage = parsedData["links"]["website"];
                    if(parsedData["links"]["flickr"] == null){
                        flickrMessage = errorMessage;
                    }else flickrMessage = parsedData["links"]["flickr"];
                    if(parsedData["links"]["twitter"] == null){
                        twitterMessage = errorMessage;
                    }else twitterMessage = parsedData["links"]["twitter"];
                     if(parsedData["links"]["elon_twitter"] == null){
                        twitterElonMessage = errorMessage;
                    }else twitterElonMessage = parsedData["links"]["elon_twitter"];
                    let spacexWebsiteButton = new navDisbut.MessageButton()
                    .setStyle('url')
                    .setLabel('Website') //default: NO_LABEL_PROVIDED
                    .setID('click_to_function') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
                    .setURL(`${websiteMessage}`)
                    let spacexFlickrButton = new navDisbut.MessageButton()
                    .setStyle('url')
                    .setLabel('Flickr') 
                    .setID('click_to_function') 
                    .setURL(`${flickrMessage}`)
                    let spacexTwitterButton = new navDisbut.MessageButton()
                    .setStyle('url')
                    .setLabel('Twitter') 
                    .setID('click_to_function') 
                    .setURL(`${twitterMessage}`)
                    let spacexTwitterElonButton = new navDisbut.MessageButton()
                    .setStyle('url')
                    .setLabel('Elons Twitter') 
                    .setID('click_to_function') 
                    .setURL(`${twitterElonMessage}`)
                    let spacexcompanyembed = new Discord.MessageEmbed()
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
                        parsedData["headquarters"]["state"]
                    )
                    .setImage()
                    .setFooter("By api.spacexdata.com")
             
                    spacexmessage.channel.send({buttons: [spacexWebsiteButton,spacexFlickrButton,spacexTwitterButton,spacexTwitterElonButton],
                        embed: spacexcompanyembed
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