/**
 * Name: Ethan Herndon
 * Filename: messages.js
 * Description: The .js file sends messages when a user directly interacts with the bot.
 * API: None 
*/
const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;

bot.on('guildMemberAdd', member => { //When users join a server, they are greeted with a message from the bot.

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

bot.on('message', msg => { //Bot replies back when user says 'goodnight', 'gm' etc

    if ((msg.content === "Good Morning") || (msg.content === "gm") || (msg.content === "morning") ||
        (msg.content === "good morning")) {
        msg.reply(" Good Morning Friend!");
    }

    if ((msg.content === "Good Night") || (msg.content === "gn") || (msg.content === "night") ||
        (msg.content === "good night")) {
        msg.reply(" Good Night Friend!");
    }

    if ((msg.content === "Good Afternoon") || (msg.content === "ga") || (msg.content === "afternoon") ||
        (msg.content === "good afternoon")) {
        msg.reply(" Good Afternoon Friend!");
    }

})

/*
bot.on("presenceUpdate", (oldPresence, newPresence) => {
    //TODO: Fix streaming spam
       //let channel = newPresence.guild.channels.cache.get(c => c.name === 'streaming')
    
       if (!newPresence.activities) return false;
        newPresence.activities.forEach(activity => {
            if (activity.type == "streaming") {
                console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);
                let guildChannels = newPresence.guild.channels;
                const ticketChannel = guildChannels.guild.channels.cache.find(channel => channel.name === 'streaming')
                ticketChannel.send(`${newPresence.user.tag} is streaming at ${activity.url}.`)
            };
        });
    
    });
*/
bot.on('ready', () => {
    console.log('Messages are ready commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy