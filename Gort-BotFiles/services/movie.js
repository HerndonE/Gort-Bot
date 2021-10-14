const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
var moviemessage;
const moviePREFIX = '.';
const helper = require("../helpers/helper.js");
const paginate = require('discord.js-pagination');

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
                //http://www.omdbapi.com/?apikey=thewdb&s=starwars&page=1
                //The api only displays 10 results per page.
                //TODO: iterate results.
                request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {}
                    if (response.statusCode >= 400) {
                        console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                        if (helper.helperVals.sendMessageToCreator == false) {
                            bot.users.cache.get(`${helper.helperVals.USERID}`).send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                                "It is imperative that this situation gets resolved");
                            helper.sendMessageAboutAPI(moviemessage);
                            helper.helperVals.sendMessageToCreator = true;
                        }
                        return;
                    } else {
                        //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                    }
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

                    if (length(parsedData.Search) < 10) {
                        console.log("Result set: " + length(parsedData.Search));
                        //TODO: Dynamically allocate size for results
                        //moviemessage.channel.send("Not enough results! Try again!")
                        for (var i = 0; i < length(parsedData.Search); i++) {
                            var image;
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
                                        "**IMDB ID:** " + parsedData["Search"][i]["imdbID"] + '\n'

                                    )
                                    .setImage(image)
                                    .setFooter('By http://www.omdbapi.com')

                            });
                        }
                        return;
                    }

                    var someInt = length(parsedData.Search);
                    console.log("Result set: " + someInt);


                    moviemessage.channel.send("Here are your results" + "\n" +
                        "If there was a result you didn't find, search again.").then(embdReact => {


                        var imageOne;
                        var imageTwo;
                        var imageThree;
                        var imageFour;
                        var imageFive;
                        var imageSix;
                        var imageSeven;
                        var imageEight;
                        var imageNine;
                        var imageTen;
                        var notAvail = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
                        if (parsedData["Search"][0]["Poster"] != "N/A") {
                            imageOne = parsedData["Search"][0]["Poster"]
                        } else
                            imageOne = notAvail;

                        if (parsedData["Search"][1]["Poster"] != "N/A") {
                            imageTwo = parsedData["Search"][1]["Poster"]
                        } else
                            imageTwo = notAvail;

                        if (parsedData["Search"][2]["Poster"] != "N/A") {
                            imageThree = parsedData["Search"][2]["Poster"]
                        } else
                            imageThree = notAvail;

                        if (parsedData["Search"][3]["Poster"] != "N/A") {
                            imageFour = parsedData["Search"][3]["Poster"]
                        } else
                            imageFour = notAvail;

                        if (parsedData["Search"][4]["Poster"] != "N/A") {
                            imageFive = parsedData["Search"][4]["Poster"]
                        } else
                            imageFive = notAvail;

                        if (parsedData["Search"][5]["Poster"] != "N/A") {
                            imageSix = parsedData["Search"][5]["Poster"]
                        } else
                            imageSix = notAvail;

                        if (parsedData["Search"][6]["Poster"] != "N/A") {
                            imageSeven = parsedData["Search"][6]["Poster"]
                        } else
                            imageSeven = notAvail;

                        if (parsedData["Search"][7]["Poster"] != "N/A") {
                            imageEight = parsedData["Search"][7]["Poster"]
                        } else
                            imageEight = notAvail;

                        if (parsedData["Search"][8]["Poster"] != "N/A") {
                            imageNine = parsedData["Search"][8]["Poster"]
                        } else
                            imageNine = notAvail;

                        if (parsedData["Search"][9]["Poster"] != "N/A") {
                            imageTen = parsedData["Search"][9]["Poster"]
                        } else
                            imageTen = notAvail;


                        const p1 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][0]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][0]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][0]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][0]["imdbID"] + '\n'
                            )
                            .setImage(imageOne)
                            .setFooter('By http://www.omdbapi.com')

                        const p2 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][1]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][1]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][1]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][1]["imdbID"] + '\n'
                            )
                            .setImage(imageTwo)
                            .setFooter('By http://www.omdbapi.com')

                        const p3 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][2]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][2]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][2]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][2]["imdbID"] + '\n'
                            )
                            .setImage(imageThree)
                            .setFooter('By http://www.omdbapi.com')

                        const p4 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][3]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][3]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][3]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][3]["imdbID"] + '\n'
                            )
                            .setImage(imageFour)
                            .setFooter('By http://www.omdbapi.com')

                        const p5 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][4]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][4]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][4]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][4]["imdbID"] + '\n'
                            )
                            .setImage(imageFive)
                            .setFooter('By http://www.omdbapi.com')

                        const p6 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][5]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][5]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][5]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][5]["imdbID"] + '\n'
                            )
                            .setImage(imageSix)
                            .setFooter('By http://www.omdbapi.com')

                        const p7 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][6]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][6]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][6]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][6]["imdbID"] + '\n'
                            )
                            .setImage(imageSeven)
                            .setFooter('By http://www.omdbapi.com')

                        const p8 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][7]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][7]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][7]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][7]["imdbID"] + '\n'
                            )
                            .setImage(imageEight)
                            .setFooter('By http://www.omdbapi.com')

                        const p9 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][8]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][8]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][8]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][8]["imdbID"] + '\n'
                            )
                            .setImage(imageNine)
                            .setFooter('By http://www.omdbapi.com')

                        const p10 = new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setDescription("**Title:** " + parsedData["Search"][9]["Title"] + '\n' +
                                "**Year:** " + parsedData["Search"][9]["Year"] + '\n' +
                                "**Type:** " + parsedData["Search"][9]["Type"] + '\n' +
                                "**IMDB ID:** " + parsedData["Search"][9]["imdbID"] + '\n'
                            )
                            .setImage(imageTen)
                            .setFooter('By http://www.omdbapi.com')

                     
                        let pages = [
                            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10
                        ]

                        let emojis = [
                            "⬅️",
                            "➡️",
                        ]

                       

                        paginate(moviemessage, pages, emojis, 120000)
                        return;

                    })



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