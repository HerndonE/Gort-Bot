const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
var mysql = require('mysql');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("./sanitize");

var express = require('express');
var app = express()
app.use(express.static("public"))

// add secretes
const token = 'YOURTOKENHERE';
exports.token = token;
const PREFIX = '.';
const imagePREFIX = '.';
var version = '1.0.5'
var imagemessage;

Weather = require("./weather");
ChuckNorris = require("./chucknorris");
RickandMorty = require("./rickandmorty");
CovidTracker = require("./covidtracker");
Movie = require("./movie");

bot.on('message', imagemessage => {

    let raw_userinput = imagemessage.content.substring(imagePREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    var newText;
    var apiKey = 'YOURAPIKEY';
    switch (args[0]) {
        case 'image':

            const check = args.join(" ");
            if (args[1] == null) {
                imagemessage.channel.send("What are you doing?!")

                return;
            }
            if (check.includes("image")) {
                newText = check.replace("image", "");
            }

            var url = `https://pixabay.com/api/?key=${apiKey}=` + newText + "&orientation=" + "vertical";
            request(url, function(err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    
                    if (body == '{"total":0,"totalHits":0,"hits":[]}') {
                      
                        imagemessage.channel.send("Error! You may have mistyped something. :(")
                        return;
                    }
                }
                let parsedData = JSON.parse(body)
                let randomIndex = Math.floor(Math.random() * 20);


                imagemessage.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Gort Image Search!")
                        .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc')
                        .setColor("0x999999")
                        .setImage(parsedData.hits[randomIndex].largeImageURL) //certain instances like this can occur
                        //Cannot read property 'largeImageURL' of undefined
                        .setTimestamp()
                        .setFooter('By Pixabay')

                }); //I later want to be able to scroll left and right on photos       
                //➡️ ⬅️

            });
            break;
    }
})

const cmdEmbed = {
    color: 0x999999,
    title: 'Command List',
    author: {
        name: 'Gort Bot',
        icon_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc',
    },
    fields: [{
            name: '**1. Weather**',
            value: '_.weather " "_',
            inline: true,
        },
        {
            name: '**2. Version #**',
            value: '_.info version #_',
            inline: true,
        },
        {
            name: '**3. Movie**',
			value: '_.weather " "_',
            inline: true,
        },
        {
            name: '**4. Poke @ Gort**',
            value: '_.ping_',
            inline: true,
        },
        {
            name: '**5. Server Info**',
            value: '_.serverinfo_',
            inline: true,
        },
        {
            name: '**6. User Info**',
            value: '_.userinfo_',
            inline: true,
        },
        {
            name: '**7. Image Search**',
            value: '_.image " "_',
            inline: true,
        },
        {
            name: '**8. Chuck Norris**',
            value: '_.chucknorris_',
            inline: true,
        },
        {
            name: '**9. Battlezone II**',
            value: '_.bz2 info_',
            inline: true,
        },
        {
            name: "**10. Five Night's at Freddy's**",
            value: '_.fnf about_',
            inline: true,
        },
        {
            name: "**11. Rick and Morty**",
            value: '_.rnm about_',
            inline: true,
        },
    ],
    timestamp: new Date(),
    footer: {
        text: 'Created by F9bomber',
    },
};


function bz2InfoGrab(name, callback) {
    let stmt = 'SELECT * FROM bz2 WHERE name=?';
    var con = herokuConnection();

    con.query(stmt, [name], function(error, results) {
        if (error) {

            con.end();
            return callback("DNE");
        } else {
            con.end();
            return callback(results);
        }
    });

}

function bz2Dump(name) {
    let stmt = 'SELECT * FROM bz2 WHERE name=?';
    var con = herokuConnection();
    return new Promise(function(resolve, reject) {
        con.query(stmt, [name], function(error, results) {
            if (error) throw error;
            con.end();
            console.log(results);
            resolve(results);
        });
    });
}

function fnfDump(name) {
    let stmt = 'SELECT * FROM fnf WHERE name=?';
    var con = herokuConnection();
    return new Promise(function(resolve, reject) {
        con.query(stmt, [name], function(error, results) {
            if (error) throw error;
            con.end();
            console.log(results);
            resolve(results);
        });
    });
}



bot.on('message', async msg => {


    let raw_userinput = msg.content.substring(PREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");

    switch (args[0]) {
        case 'fnf':
            let fnfInfo = await fnfDump(args[1]);
            console.log(fnfInfo);
            var fnf = fnfInfo.length > 0 ? fnfInfo[0] : "DNE";
            if (fnf === "DNE") {
                msg.channel.send("What are you doing?!")
            } else {

                msg.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Five Night's at Freddy's Character Stats")
                        .setImage(fnf.picture)
                        .setColor("0x999999")
                        .setDescription(fnf.info + '\n\n' + fnf.about)
                        .setTimestamp()
                        .setFooter("Five Night's at Freddy's")
                });

            }
            //console.log("Info: " + fnf.info + '\n' + fnf.quote);
            break;
        case 'bz2':
            let bz2Info = await bz2Dump(args[1]);
            console.log(bz2Info);
            var bz2 = bz2Info.length > 0 ? bz2Info[0] : "DNE";
            if (bz2 === "DNE") {
                msg.channel.send("What are you doing?!")
            } else {

                msg.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Battlezone 2 Unit Stats")
                        .setImage(bz2.picture)
                        .setColor("0x999999")
                        .setDescription(bz2.info)
                        .setTimestamp()
                        .setFooter('Battlezone II: Combat Commander')
                });
            }

            break;
        case 'ping':
            msg.channel.send('pong!')
            break;
        case 'commands':
            msg.channel.send({
                embed: cmdEmbed
            });
            break;
        case 'info':
            if (args[1] === 'version') {
                msg.channel.send('Version ' + version)
            } else {
                msg.channel.send('come again?!')
            }
            break;
        case 'userinfo':
            let userEmbed = new Discord.MessageEmbed()
                .setColor(0x999999)
                .setTitle("User Info")
                .setDescription("This is information about you!")
                .setThumbnail(msg.guild.iconURL())
                .setAuthor(`${msg.author.username} Info`, msg.author.displayAvatarURL())
                .addField("**Username:**", `${msg.author.username}`, true)
                .addField("**Discriminator:**", `${msg.author.discriminator}`, true)
                .addField("**ID:**", `${msg.author.id}`, true)
                .addField("Status:", `${msg.author.presence.status}`, true)
                .addField("Created At:", `${msg.author.createdAt}`, true)
                .addField("Joined At:", msg.member.joinedAt, true)
                .setFooter("by Gort Bot: ", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc');
            msg.channel.send({
                embed: userEmbed
            });

            break;
        case 'serverinfo':
            const serverRoles = msg.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            let serverEmbed = new Discord.MessageEmbed()
                .setColor(0x999999)
                .setTitle("Server Info")
                .setDescription("All information about this server!")
                .setThumbnail(msg.guild.iconURL())
                .setAuthor(`${msg.guild.name} Info`, msg.guild.iconURL())
                .addField("**Server Name:**", `${msg.guild.name}`, true)
                .addField("**Server Owner:**", `${msg.guild.owner}`, true)
                .addField("**Member Count:**", `${msg.guild.memberCount}`, true)
                .addField("**Roles:**", `${serverRoles.length}`, true)
                .addField("**Humans:**", `${msg.guild.members.cache.filter(member => !member.user.bot).size}`, true)
                .addField("**Bots:**", ` ${msg.guild.members.cache.filter(member => member.user.bot).size}`, true)
                .addField("**Text Channels:**", `${msg.guild.channels.cache.filter(channel => channel.type === 'text').size}`, true)
                .addField("**Voice Channels:**", `${msg.guild.channels.cache.filter(channel => channel.type === 'voice').size}`, true)
                .addField("**Server Create Date:**", msg.guild.createdAt, true)
                .setFooter("by Gort Bot: ", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc');
            msg.channel.send({
                embed: serverEmbed
            });
            //to get role count to work properly. I modified the role count code from
            //https://github.com/MenuDocs/Discord.js-v12-Tutorials/blob/Episode-4/src/Commands/Utilities/Serverinfo.js
            break;
        case 'clear':
            if (!args[1]) return msg.reply('Error! add another argument')
            msg.channel.bulkDelete(args[1]);
            break;
    }
})


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
            greeting = "Welcome " + member.user.username + ". Leave your weapon by the door.";
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

    member.guild.channels.cache.find(channel => channel.name === 'general').send(greeting);

});

bot.on('ready', () => {
    console.log('This bot is online');


})




bot.on('message', msg => {


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

//bot.login(token);//For Local Testing
bot.login(process.env.token); //For Online Deploy