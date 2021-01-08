const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
var token = process.env.TOKEN;
const Sanitize = require("../sanitize");
const request = require('request');
const imagePREFIX = '.';
var imagemessage;
bot.on('message', imagemessage => {

    let raw_userinput = imagemessage.content.substring(imagePREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    var newText;
    var apiKey = process.env.IMAGE_APIKEY;
    switch (args[0]) {
        case 'image':
            //var check = (args[1]);//may need to reference back to this later
            const check = args.join(" ");
            if (args[1] == null) {
                imagemessage.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            }
            if (check.includes("image")) {
                newText = check.replace("image", "");
            }
            //var check3 = (args[1]);
            //if (typeof check === 'undefined')
            //{
            //console.log("User didn't enter anything");
            //return imagemessage.reply('Error! Please enter a image.')
            //}
            var url = `https://pixabay.com/api/?key=${apiKey}=` + newText + "&orientation=" + "vertical";
            request(url, function(err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    //console.log('body:', body);
                    if (body == '{"total":0,"totalHits":0,"hits":[]}') {
                        //console.log('wow');
                        imagemessage.channel.send("Error! You may have mistyped something. :(")
                        return;
                    }
                }
                let parsedData = JSON.parse(body)
                let randomIndex = Math.floor(Math.random() * 20);
                //resolve(parsedData);
                //console.log("results", {"images":parsedData});

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

bot.on('ready', () => {
    console.log('Image search is ready commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy