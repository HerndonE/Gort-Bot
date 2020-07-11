const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("./sanitize");
var Index = require('./index');
var token = Index.token;
const rnmPrefix = '.';
var rickandmortymessage;

bot.on('message', rickandmortymessage => {

    let raw_userinput = rickandmortymessage.content.substring(rnmPrefix.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    var charText;
    let characterBool = false;

    switch (args[0]) {
        case 'rnm':
            const text = args.join(" ");

            if (args[1] == null) {
                rickandmortymessage.channel.send("What are you doing?!")

                return;
            } else if (text.includes("rnm")) {
                var newText = text.replace("rnm", "");

                if (args[1].includes("about")) {
                    rickandmortymessage.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setTitle("Rick and Morty Commands")
                            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/3/32/Rick_and_Morty_opening_credits.jpeg')
                            .setColor("0x999999")
                            .setDescription("To learn about the show Rick and Morty " +
                                "use these commands for more info." + '\n' +
                                "**Character Search:**" + '\n' +
                                "EX: _.rnm character rick_" + '\n' +
                                "**Location Search:**" + '\n' +
                                "EX: _.rnm location earth_" + '\n' +
                                "**Episode Search:**" + '\n' +
                                "EX: _.rnm episode 24_" + '\n')
                            .setTimestamp()
                            .setImage('https://upload.wikimedia.org/wikipedia/en/b/b0/Rick_and_Morty_characters.jpg')
                            .setFooter('By Rick and Morty API')
                    });
                }
                if (args[1].includes("location")) {
                    if (newText.includes("location")) {
                        charText = newText.replace("location", "").trim();
                        console.log("New Text:" + charText);
                        var url = `https://rickandmortyapi.com/api/location/?name=${charText}`;
                        console.log(url);
                        request(url, function(err, response, body) {
                            if (err) {
                                console.log('error:', err);

                            } else {

                                if (body == ('{"error": "There is nothing here"}')) {

                                    rickandmortymessage.channel.send("_Yeah, sure, I mean, if you spend all day shuffling words_" +
                                        " _around, you can make anything sound bad, Morty._")
                                    return;
                                }
                            }
                            let parsedData = JSON.parse(body)
                            if (parsedData["error"]) {
                                rickandmortymessage.channel.send("_Yeah, sure, I mean, if you spend all day shuffling words_" +
                                    " _around, you can make anything sound bad, Morty._")
                                return;
                            }
                            rickandmortymessage.channel.send({
                                embed: new Discord.MessageEmbed()
                                    .setTitle("Rick and Morty Location Search!")
                                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/3/32/Rick_and_Morty_opening_credits.jpeg')
                                    .setColor("0x999999")
                                    .setDescription(
                                        `**Name:** ${parsedData["results"][0]['name']}
**Type:** ${parsedData["results"][0]['type']}
**Dimension:** ${parsedData["results"][0]['dimension']}
**Created:** ${parsedData["results"][0]['created']}
`)
                                    .setTimestamp()
                                    .setFooter('By https://rickandmortyapi.com')

                            });
                        });

                    }
                }

                if (args[1].includes("character")) {
                    =
                    if (newText.includes("character")) {
                        charText = newText.replace("character", "").trim();
                        console.log("New Text:" + charText);
                        rickandmortymessage.channel.send("Enter a status for " + charText +
                            " ex: _alive_, _dead_ or _unknown_.")
                        const collector = new Discord.MessageCollector(rickandmortymessage.channel, m =>
                            m.author.id === rickandmortymessage.author.id, {
                                time: 10000
                            }); //Collector reference: https://stackoverflow.com/a/45856621
                        //console.log(collector)
                        collector.on('collect', message => {
                            if ((message.content == "alive") || (message.content == "dead") || (message.content == "unknown")) {
                                //console.log(charText);
                                var url = `https://rickandmortyapi.com/api/character/?name=${charText}&status=${message.content}`;
                                console.log(url);
                                request(url, function(err, response, body) {
                                    if (err) {
                                        console.log('error:', err);
                                    } else {
                                        //console.log('body:', body);
                                        if (body == ('{"error": "There is nothing here"}')) {
                                            //console.log('wow');
                                            rickandmortymessage.channel.send("_Yeah, sure, I mean, if you spend all day shuffling words_" +
                                                " _around, you can make anything sound bad, Morty._")
                                            return;
                                        }
                                    }
                                    let parsedData = JSON.parse(body)
                                    if (parsedData["error"]) {
                                        rickandmortymessage.channel.send("_Yeah, sure, I mean, if you spend all day shuffling words_" +
                                            " _around, you can make anything sound bad, Morty._")
                                        return;
                                    }
                                    rickandmortymessage.channel.send({
                                        embed: new Discord.MessageEmbed()
                                            .setTitle("Rick and Morty Character Search!")
                                            .setThumbnail('https://upload.wikimedia.org/wikipedia/en/3/32/Rick_and_Morty_opening_credits.jpeg')
                                            .setColor("0x999999")
                                            .setDescription(
                                                `**Name:** ${parsedData["results"][0]['name']}
**Status:** ${parsedData["results"][0]['status']}
**Species:** ${parsedData["results"][0]['species']}
**Gender:** ${parsedData["results"][0]['gender']}
**Type:** ${parsedData["results"][0]['type']}
**Origin:** ${parsedData["results"][0]['origin']["name"]}
**Location:** ${parsedData["results"][0]['location']["name"]}
`)
                                            .setImage(parsedData["results"][0]['image'])
                                            .setTimestamp()
                                            .setFooter('By https://rickandmortyapi.com')

                                    });
                                });
                            } else {
                                message.channel.send("_Lemme check my list of powers and weaknesses: ability to do anything,_ " +
                                    "_but only whenever I want._ Try again.");
                                return;
                            }
                        })

                    }

                }


                if (args[1].includes("episode")) {

                    if (args[2] === undefined || args[2].length == 0 || isNaN(args[2])) {
                        rickandmortymessage.channel.send("What are you doing?!")
                        return;
                    } else if (!isNaN(args[2])) {
                        var url = `https://rickandmortyapi.com/api/${args[1]}/${args[2]}`;
                        request(url, function(err, response, body) {
                            if (err) {
                                console.log('error:', err);
                            } else {
                                console.log('body:', body);
                                if (body == ('{"error":"Episode not found"}')) {

                                    rickandmortymessage.channel.send("_Yeah, sure, I mean, if you spend all day shuffling words_" +
                                        " _around, you can make anything sound bad, Morty._")
                                    return;
                                }

                            }
                            let parsedData = JSON.parse(body)
                            rickandmortymessage.channel.send({
                                embed: new Discord.MessageEmbed()
                                    .setTitle("Rick and Morty Episode Search!")
                                    .setThumbnail('https://upload.wikimedia.org/wikipedia/en/3/32/Rick_and_Morty_opening_credits.jpeg')
                                    .setColor("0x999999")
                                    .setDescription("**Episode Name: **" + parsedData.name + '\n' +
                                        "**Air Date: **" + parsedData.air_date + '\n' +
                                        "**Episode: **" + parsedData.episode + '\n' +
                                        "**Create: **" + parsedData.created + '\n')
                                    .setTimestamp()
                                    .setFooter('By https://rickandmortyapi.com')

                            });
                        });
                    }
                } //for single episode search
            }

            break;
    }
})

bot.on('ready', () => {
    console.log('Rick Sanchez is Ready Commander');
})

//bot.login(token);//For Local Testing
bot.login(process.env.token); //For Online Deploy