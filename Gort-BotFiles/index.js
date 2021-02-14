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

bot.on('guildMemberAdd', member => {

    var ran = Math.floor(Math.random() * 5);
    var greeting;
    switch (ran) {
        case 0:
            greeting = "Brace yourselves. " + member.user.username + " just joined the server.";
            break;
        case 1:
            greeting = "Challenger approaching - " + member.user.username + " has appeared";
            break;
        case 2:
            greeting = "Welcome " + member.user.username + ". Leave your shoes by the door.";
            break;
        case 3:
            greeting = "Hello " + member.user.username + ". Its good to see you!";
            break;
        case 4:
            greeting = "Luckily the weather is on our side today! The sun and I are pleased to offer  " + member.user.username + " a warm welcome.";
            break;
        case 5:
            greeting = "Ladies and gentlemen, the room is ready. The tables are set. The band is playing our theme song. And the waiting staff are preparing to take your orders. This is a superb welcome, fit for royalty, and that's what " +
                member.user.username + " are to us.";
            break;

    }
    //const channels = ['general'];
    //channels.forEach(c => {
    //const ch = member.guild.channels.cache.find(channel => channel.name === c);
    //ch.send(greeting);
    //});
    //member.guild.channels.cache.get('295423209472262146').send(greeting);
    member.guild.channels.cache.find(channel => channel.name === 'general').send(greeting);

});

bot.on('ready', () => {
    console.log('This bot is online');
    bot.user.setActivity("on Heroku.com | .cmds");
    console.log(bot.guilds.cache.size);


})



//let channel = message.guild.channels.cache.get(c => c.name === 'the channel name')
//channel.send("Your message")


bot.on("presenceUpdate", (oldPresence, newPresence) => {
//TODO: Fix streaming spam
   //let channel = newPresence.guild.channels.cache.get(c => c.name === 'streaming')

   /* if (!newPresence.activities) return false;
    oldPresence.activities.forEach(activity => {
        //console.log(`${newPresence.user.tag} user is now ${newPresence.status} in guild ${newPresence.guild.name}`);
        if (activity.type == "STREAMING") {
            console.log("Wow Ethan!");
            return;
        };
    });
    newPresence.activities.forEach(activity => {
        //console.log(`${newPresence.user.tag} user is now ${newPresence.status} in guild ${newPresence.guild.name}`);
        if (activity.type == "STREAMING") {
            console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);
            let guildChannels = newPresence.guild.channels;
            const ticketChannel = guildChannels.guild.channels.cache.find(channel => channel.name === 'streaming')
            ticketChannel.send(`${newPresence.user.tag} is streaming at ${activity.url}.`)

        };
    });*/

});


bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy