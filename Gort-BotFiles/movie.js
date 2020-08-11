const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("./sanitize");
var Index = require('./index');
var token = Index.token;
var moviemessage;
const moviePREFIX = '.';


bot.on('message', moviemessage => {
    let raw_userinput = moviemessage.content.substring(moviePREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");

    switch (args[0]) {
        case 'movie':
            const text = args.join(" ");

            if (args[1] == null) {
                moviemessage.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            } else if (text.includes("movie")) {
                var newText = text.replace("movie ", "");
                //console.log(newText);
                var url = 'http://www.omdbapi.com/?apikey=thewdb&s=' + newText;
                request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {}
                    let parsedData = JSON.parse(body)

                    if (parsedData["error"]) {

                        moviemessage.channel.send("Movie not found! Try again!")
                        return;
                    }



                    //length(parsedData); 
                    //console.log("1: " + length(parsedData));
                    //length(parsedData.Search); 
                    //console.log("2: " + length(parsedData.Search));

                    if (length(parsedData.Search) === undefined) {
                        moviemessage.channel.send("Movie not found! Try again!")
                        return;
                    }
                    if (length(parsedData.Search) === null) {
                        moviemessage.channel.send("Movie not found! Try again!")
                        return;
                    }



                    var image;

                    for (var i = 0; i < length(parsedData.Search); i++) {

                        if (parsedData["Search"][i]["Poster"] == "N/A") {
                            image = "";

                        } else {
                            image = parsedData["Search"][i]["Poster"];
                        }
                        moviemessage.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setColor("0x999999")
                                .setDescription("**Title:** " + parsedData["Search"][i]["Title"] + '\n' +
                                    "**Year:** " + parsedData["Search"][i]["Year"] + '\n' +
                                    "**Type:** " + parsedData["Search"][i]["Type"] + '\n' +
                                    "**IMDB ID:** " + parsedData["Search"][i]["imdbID"] + '\n' +
                                    parsedData["Search"][i]["Poster"]
                                )
                                .setImage(image)
                                //.setTimestamp()
                                .setFooter('By http://www.omdbapi.com')
                        });

                    }

                });
                return;
            }


            break;
    }
})

bot.on('ready', () => {
    console.log('Movie Function is Ready Commander');
})

bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy

function length(obj) {
    if (obj === undefined) {
        return undefined;
    }
    if (obj === null) {
        return null;
    } else
        return Object.keys(obj).length;
}