const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
const PREFIX = '.';
var version = '1.0.9'
const paginate = require('discord.js-pagination');
var data = require('./database');

/*
Command List
*/

const cmdEmbed = {
    color: 0x999999,
    title: 'Command List',
    author: {
        name: 'Gort Bot',
        icon_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc',
    },
    description: "Welcome to my navigation page! Simply use the arrow bottons to search commands." + '\n' + '\n' +
        "**Legend**" + '\n' +
        "1. **Information**" + '\n' +
        "2. **Utility**" + '\n' +
        "3. **Games**" + '\n' +
        "4. **Accessories**",
    timestamp: new Date(),
    footer: {
        text: 'Bot created by F9bomber.',
    },
};

/*
Information List
*/

const cmdInfo = {
    color: 0x999999,
    title: 'Information List',
    fields: [{
            name: '**1. Information**',
            value: '_.info_',
            inline: true,
        },
        {
            name: '**2. Server Info**',
            value: '_.serverinfo_',
            inline: true,
        },
        {
            name: '**3. User Info**',
            value: '_.userinfo_',
            inline: true,
        },
    ],
};


/*
Utility List
*/

const cmdUti = {
    color: 0x999999,
    title: 'Utility List',
    fields: [{
            name: '**1. Weather**',
            value: '_.weather " "_',
            inline: true,
        },
        {
            name: '**2. Covid**',
            value: '_.covid about_',
            inline: true,
        },
        {
            name: '**3. Movie**',
            value: '_.movie " "_',
            inline: true,
        },
    ],
};


/*
Games List
*/

const cmdGames = {
    color: 0x999999,
    title: 'Games List',
    fields: [{
            name: '**1. Battlezone II**',
            value: '_.bz2 info_',
            inline: true,
        },
        {
            name: '**2. PlanetSide 2**',
            value: '_.ps2 about_',
            inline: true,
        },
        /*{
            name: "**3. Five Night's at Freddy's**",
            value: '_.fnf about_',
            inline: true,
        },*/
    ],
};

/*
Accessories List
*/

const cmdAcc = {
    color: 0x999999,
    title: 'Accessories List',
    fields: [{
            name: '**1. Image Search**',
            value: '_.image " "_',
            inline: true,
        },
        {
            name: '**2. Chuck Norris**',
            value: '_.chucknorris_',
            inline: true,
        },
        {
            name: "**3. Ping @ Gort**",
            value: '_.ping_',
            inline: true,
        },
        {
            name: "**4. Rick and Morty**",
            value: '_.rnm about_',
            inline: true,
        },
        {
            name: "**5. Animal Search**",
            value: '_.animals_',
            inline: true,
        },
    ],
};

/*
Animals List
*/

const cmdAni = {
    color: 0x999999,
    title: 'Animals List',
    fields: [{
            name: '**1. Cat Search**',
            value: '_.cat_',
            inline: true,
        },
        {
            name: '**2. Dog Search**',
            value: '_.dog_',
            inline: true,
        },
    ],
};

function bz2InfoGrab(name, callback) {
    let stmt = 'SELECT * FROM bz2 WHERE name=?'; //column name
    var con = data.herokuConnection();

    con.query(stmt, [name], function(error, results) {
        if (error) {
            //add error message
            con.end();
            return callback("DNE");
        } else {
            con.end();
            return callback(results);
        } //throw error;

        //console.log(results);
        //return callback(results[0]);
    });

}

function bz2Dump(name) {
    let stmt = 'SELECT * FROM bz2 WHERE name=?';
    var con = data.herokuConnection();
    return new Promise(function(resolve, reject) {
        con.query(stmt, [name], function(error, results) {
            if (error) throw error;
            con.end();
            console.log(results);
            resolve(results);
        });
    });
}

/*function fnfDump(name) {
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
*/
bot.on('message', async msg => {
    // let args = msg.content.substring(PREFIX.length).split(" ");

    let raw_userinput = msg.content.substring(PREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");


    switch (args[0]) {
        case 'commands':
        case 'cmds':
            //msg.channel.send({ embed: cmdEmbed });
            const p1 = new Discord.MessageEmbed(cmdEmbed)
                .setTitle("Navigation 🧭")

            const p2 = new Discord.MessageEmbed(cmdInfo)
                .setTitle("Information List ℹ️")

            const p3 = new Discord.MessageEmbed(cmdUti)
                .setTitle("Utility List 🚙")

            const p4 = new Discord.MessageEmbed(cmdGames)
                .setTitle("Games List 🎲")

            const p5 = new Discord.MessageEmbed(cmdAcc)
                .setTitle("Accessories List 👜")

            let pages = [
                p1, p2, p3, p4, p5
            ]

            let emojis = [
                "⬅️",
                "➡️",
            ]

            paginate(msg, pages, emojis, 60000)
            break;

/*        case 'fnf':
            let fnfInfo = await fnfDump(args[1]);
            console.log(fnfInfo);
            var fnf = fnfInfo.length > 0 ? fnfInfo[0] : "DNE";
            if (fnf === "DNE") {
                msg.channel.send("What are you doing?!")
            } else {
                //msg.channel.send(fnf.info)
                //msg.channel.send(bz2.picture)
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
            break;*/
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
                        .setImage(bz2.picture) //column name
                        .setColor("0x999999")
                        .setDescription(bz2.info) //column name
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
        case 'cmds':
            msg.channel.send({
                embed: cmdEmbed
            });
            break;
        case 'info':
            msg.channel.send({
                embed: new Discord.MessageEmbed()
                    .setTitle("Gort Bot Information")
                    .setColor("0x999999")
                    .setDescription(`**Version:** ${version} 
            
**Invite Gort** [here](https://discord.com/oauth2/authorize?client_id=723709096175468636&scope=bot)
            
🤖 Gort Bot can be found in **${bot.guilds.cache.size}** servers
            
**Why was I created?**
    I was created as a multi-purpose discord bot focusing on enhancing your expierence.
              
I am following Isaac Asimovs "Three Laws of Robotics"
    **First Law**
    A robot may not injure a human being or, through inaction, allow a human being to come to harm.
   **Second Law**
    A robot must obey the orders given it by human beings except where such orders would conflict with the First Law.
    **Third Law**
    A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.
              `)
                    .setTimestamp()
            });
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
                .setFooter("by Gort Bot. ", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc');
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
                .setFooter(`by Gort Bot. `, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc');
            msg.channel.send({
                embed: serverEmbed
            });
            //to get role count to work properly. I modified the role count code from
            //https://github.com/MenuDocs/Discord.js-v12-Tutorials/blob/Episode-4/src/Commands/Utilities/Serverinfo.js
            break;
        case 'animals':
            msg.channel.send({
                embed: cmdAni
            });
            break;
        case 'clear':
            if (!args[1]) return msg.reply('Error! add another argument')
            msg.channel.bulkDelete(args[1]);
            break;
    }
})


bot.on('ready', () => {
    console.log('Navigation is ready commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy