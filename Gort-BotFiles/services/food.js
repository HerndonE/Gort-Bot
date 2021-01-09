const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
var foodmessage;
const foodPREFIX = '.';
const paginate = require('discord.js-pagination');

//https://developers.zomato.com/api
//http://taco-randomizer.herokuapp.com/random/?full-taco=true/contributors/:recipe_type/
//https://foodish-api.herokuapp.com/api/
//https://www.openbrewerydb.org/
//https://developers.zomato.com/api

//Nasa TODO
//https://api.nasa.gov/

//Exhange Rate
//https://www.exchangerate-api.com/docs/enriched-data-requests

const cmdFood = {
    color: 0x999999,
    title: 'Food List',
    fields: [{
            name: '**1. Random Food**',
            value: '_.food_',
            inline: true,
        },
        {
            name: '**2. Taco Recipes**',
            value: '_.taco_',
            inline: true,
        },
    ],
};


bot.on('message', foodmessage => {
    let raw_userinput = foodmessage.content.substring(foodPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    
    var text;
    switch (args[0]) {
        case 'food':
            const input = args.join(" ");
            console.log(input);

            if (input == null || !isNaN(input)) {
                foodmessage.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            } 
            if(input == "food"){
                var url = "https://foodish-api.herokuapp.com/api/"; //random food api
                 request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        console.log('body:', body);
                    }
                    let parsedData = JSON.parse(body)
                    
                    foodmessage.channel.send({
                    embed: new Discord.MessageEmbed()
                    .setColor("0x999999")
                    .setImage(parsedData["image"])
                    });
             });
            }
            
            else
            {
                text = input.replace("food ", "");
                console.log(text);
                if(text.includes('about')){
                     foodmessage.channel.send({ embed: cmdFood})
                }
            }
            
        break;
        
        case 'taco':
             var baseLayer;
             var condiment;
             var shellRecipe;
             var url = 'http://taco-randomizer.herokuapp.com/random/?full-taco=true'; //Taco API
             request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        //console.log('body:', body);
                    }
                    let parsedData = JSON.parse(body)
                
                baseLayer = parsedData["base_layer"]["recipe"];  
                condiment = "Sorry there is no condiment for this Taco";
                if(parsedData["condiment"]){ // - OC
                    if(parsedData["condiment"]["recipe"]){
                        condiment = parsedData["condiment"]["recipe"];
                    }
                }
                
                //check if they are more than 2000 words. Otherwise it is ok for now
                 
                shellRecipe = "Sorry there is no shell recipe for this Taco";
                if(parsedData["shell"]){
                    if(parsedData["shell"]["recipe"]){
                        shellRecipe = parsedData["shell"]["recipe"];
                    }
                }
                
          
                const p1 = new Discord.MessageEmbed()
                .setColor("0x999999")
                .setTitle(parsedData["slug"])
                .setDescription(parsedData["recipe"])

                const p2 = new Discord.MessageEmbed()
                .setColor("0x999999")
                .setTitle("Base Layer")
                .setDescription(baseLayer)

                const p3 = new Discord.MessageEmbed()
                .setColor("0x999999")
                .setTitle("Condiment Recipe")
                .setDescription(condiment)

                const p4 = new Discord.MessageEmbed()
                .setColor("0x999999")
                .setTitle("Shell Recipe")
                .setDescription(shellRecipe)

                let pages = [
                p1, p2, p3, p4
                ]

                let emojis = [
                "⬅️",
                "➡️",
               ]

               paginate(foodmessage, pages, emojis, 180000)
                    
             });
        break;
    }
})

bot.on('ready', () => {
    console.log('Gordan Ramsey is mad Commander');
})

bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy
