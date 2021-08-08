/*
Gort Bot for Discord
Made by: Ethan Herndon
Desc: A bot made using fun applications while using Discord. A desired project that is
now coming to life!
github.com/HerndonE
Gort Bot Version: 1.0.11
*/
const Discord = require('discord.js');
const bot = new Discord.Client();
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("./sanitize");
require('dotenv').config();
const token = process.env.TOKEN;
exports.token = token;

const navDisbut = require('discord.js-buttons')(bot); //New Button Styles
exports.navDisbut = navDisbut;


//const gortFileImage = new Discord.MessageAttachment('../public/Images/Gort.jpg');

/*******Services*******/
Weather = require("./services/weather");
ChuckNorris = require("./services/chucknorris");
RickandMorty = require("./services/rickandmorty");
CovidTracker = require("./services/covidtracker");
Movie = require("./services/movie");
PlanetSide2 = require("./services/planetside2");
Images = require("./services/imagesearch");
Animals = require("./services/animals");
Food = require("./services/food");
Spacex = require("./services/spacex");
/*******Messages*******/
Messages = require("./messages/messages");
Navigation = require("./messages/navigation");
Advice = require("./messages/advice");

bot.on('ready', () => {
    console.log('This bot is online');
    bot.user.setActivity("on Heroku.com | .cmds");
    console.log(bot.guilds.cache.size);


})

bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy