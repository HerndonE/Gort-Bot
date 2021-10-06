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
const helper = require("../helpers/helper.js");

//Nasa TODO
//https://developers.zomato.com/api
//https://api.nasa.gov/

//Exhange Rate
//https://www.exchangerate-api.com/docs/enriched-data-requests

/*
Food List
*/

const cmdFood = {
    color: 0x999999,
    title: 'Food List',
    fields: [{
            name: '**1. Random Food**',
            value: '_.food_',
            inline: true,
        },
        /* API no longer working, keeping this for documentation
        { 
            name: '**2. Taco Recipes**',
            value: '_.taco_',
            inline: true,
        },
        */
        {
            name: '**2. Find Breweries**',
            value: '_.breweries about_',
            inline: true,
        },
    ],
};

/*
Brewery List
*/

const cmdBreweries = {
    color: 0x999999,
    title: 'Brewery List',
    fields: [{
            name: '**1. Find brewery by city**',
            value: '_.breweries city "CITYNAME"_',
            inline: true,
        },
        {
            name: '**2. Find brewery by name**',
            value: '_.breweries name "BREWERYNAME"_',
            inline: true,
        },
        {
            name: '**3. Find brewery by state**',
            value: '_.breweries state "STATE"_',
            inline: true,
        },
        {
            name: '**4. Find brewery by zip code**',
            value: '_.breweries zip "ZIPCODE"_',
            inline: true,
        },
        {
            name: '**5. Brewery information provided by**',
            value: 'https://www.openbrewerydb.org/',
            inline: true,
        },
    ],
};

var brewText;

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
            if (input == "food") {
                var url = "https://foodish-api.herokuapp.com/api/" //random food api
                request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        console.log('body:', body);
                    }
                    if (response.statusCode >= 400) {
                        console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                        if (helper.helperVals.sendMessageToCreator == false) {
                            bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                                "It is imperative that this situation gets resolved");
                            helper.sendMessageAboutAPI(foodmessage);
                            helper.helperVals.sendMessageToCreator = true;
                        }
                        return;
                    } else {
                        //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                    }
                    let parsedData = JSON.parse(body)

                    foodmessage.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setColor("0x999999")
                            .setImage(parsedData["image"])
                    });
                });
            } else {
                text = input.replace("food ", "");
                console.log(text);
                if (text.includes('about')) {
                    foodmessage.channel.send({
                        embed: cmdFood
                    })
                }
            }

            break;
            /* API no longer working, keeping this for documentation
        case 'taco':
            randoTaco(foodmessage);
            break;
            */    
        case 'breweries':
            brewText = args.join(" ");
            if (args[1] == null) {
                foodmessage.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            } else if (brewText.includes("breweries")) {
                var newText = brewText.replace("breweries", "");
                if (args[1].includes("about")) {
                    foodmessage.channel.send({
                        embed: cmdBreweries
                    });
                }
                if (args[1].includes("city")) {
                    breweriesCity(foodmessage);
                }
                if (args[1].includes("name")) {
                    breweriesName(foodmessage);
                }
                if (args[1].includes("state")) {
                    breweriesState(foodmessage);
                }
                if (args[1].includes("zip")) {
                    breweriesZip(foodmessage);
                }
            }
            break;
    }

})

/* API no longer working, keeping this for documentation
function randoTaco(foodmessage) {
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

        if (response.statusCode >= 400) {
            console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
            if (helper.helperVals.sendMessageToCreator == false) {
                bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                    "It is imperative that this situation gets resolved");
                helper.sendMessageAboutAPI(foodmessage);
                helper.helperVals.sendMessageToCreator = true;
            }
            return;
        } else {
            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
        }

        let parsedData = JSON.parse(body)

        baseLayer = parsedData["base_layer"]["recipe"];
        condiment = "Sorry there is no condiment for this Taco";
        if (parsedData["condiment"]) { // - OC
            if (parsedData["condiment"]["recipe"]) {
                condiment = parsedData["condiment"]["recipe"];
            }
        }

        //check if they are more than 2000 words. Otherwise it is ok for now

        shellRecipe = "Sorry there is no shell recipe for this Taco";
        if (parsedData["shell"]) {
            if (parsedData["shell"]["recipe"]) {
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
    return;
}
*/
function breweriesCity(foodmessage) {
    var cityText = brewText.replace("breweries city ", "");
    console.log(cityText);
    var url = `https://api.openbrewerydb.org/breweries?by_city=${cityText}`; //brewery city api
    request(url, function(err, response, body) {
        if (err) {
            console.log('error:', err);
        } else {
            //console.log('body:', body);
        }
        if (response.statusCode >= 400) {
            console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
            if (helper.helperVals.sendMessageToCreator == false) {
                bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                    "It is imperative that this situation gets resolved");
                helper.sendMessageAboutAPI(foodmessage);
                helper.helperVals.sendMessageToCreator = true;
            }
            return;
        } else {
            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
        }
        let parsedData = JSON.parse(body)
        var pageLength = parsedData.length;
        var needArray = [];
        var needArray2 = [];
        var needArray3 = [];
        var greatherThan8 = false;
        var greatherThan17 = false;
        Boolean(greatherThan8);

        console.log("pageLength: " + pageLength);

        if (parsedData.length === 0) {
            foodmessage.channel.send("You may have mistyped something.");
        }

        for (var i = 0; i < pageLength; i++) { //pageLength

            if (i == 8) {
                greatherThan8 = true;
                break;
            }

            needArray.push("**Name: **" + parsedData[i]["name"] + '\n' +
                "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                "**Address: **" + parsedData[i]["street"] + " " +
                parsedData[i]["city"] + " " +
                parsedData[i]["state"] + " " +
                parsedData[i]["postal_code"] + '\n' +
                "**Website: **" + parsedData[i]["website_url"] + '\n' +
                "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
        }

        /********************************/

        if (Boolean(greatherThan8)) {
            //console.log(greatherThan8);
            for (var i = 9; i < pageLength; i++) { //pageLength
                if (i == 17) {
                    greatherThan17 = true;
                    break;
                }
                //console.log("i: " + i);
                needArray2.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        /********************************/

        if (Boolean(greatherThan17)) {
            //console.log(greatherThan8);
            for (var i = 17; i < pageLength; i++) { //pageLength
                //console.log("i: " + i);
                needArray3.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        if (needArray2.length === 0) {
            needArray2 = ["No breweries on this page."];
        }

        if (needArray3.length === 0) {
            needArray3 = ["No breweries on this page."];
        }

        const p1 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray)

        const p2 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray2)

        const p3 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray3)

        let pages = [
            p1, p2, p3
        ]

        let emojis = [
            "⬅️",
            "➡️",
        ]

        paginate(foodmessage, pages, emojis, 180000)

    });
    return;
}

function breweriesName(foodmessage) {
    var nameText = brewText.replace("breweries name ", "");
    console.log(nameText);
    var url = `https://api.openbrewerydb.org/breweries?by_name=${nameText}`; //brewery name api
    request(url, function(err, response, body) {
        if (err) {
            console.log('error:', err);
        } else {
            //console.log('body:', body);
        }
        if (response.statusCode >= 400) {
            console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
            if (helper.helperVals.sendMessageToCreator == false) {
                bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                    "It is imperative that this situation gets resolved");
                helper.sendMessageAboutAPI(foodmessage);
                helper.helperVals.sendMessageToCreator = true;
            }
            return;
        } else {
            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
        }
        let parsedData = JSON.parse(body)
        var pageLength = parsedData.length;
        var needArray = [];
        var needArray2 = [];
        var needArray3 = [];
        var greatherThan8 = false;
        var greatherThan17 = false;
        Boolean(greatherThan8);

        console.log("pageLength: " + pageLength);

        if (parsedData.length === 0) {
            foodmessage.channel.send("You may have mistyped something.");
        }

        for (var i = 0; i < pageLength; i++) { //pageLength

            if (i == 8) {
                greatherThan8 = true;
                break;
            }

            needArray.push("**Name: **" + parsedData[i]["name"] + '\n' +
                "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                "**Address: **" + parsedData[i]["street"] + " " +
                parsedData[i]["city"] + " " +
                parsedData[i]["state"] + " " +
                parsedData[i]["postal_code"] + '\n' +
                "**Website: **" + parsedData[i]["website_url"] + '\n' +
                "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
        }

        /********************************/

        if (Boolean(greatherThan8)) {
            //console.log(greatherThan8);
            for (var i = 9; i < pageLength; i++) { //pageLength
                if (i == 17) {
                    greatherThan17 = true;
                    break;
                }
                //console.log("i: " + i);
                needArray2.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        /********************************/

        if (Boolean(greatherThan17)) {
            //console.log(greatherThan8);
            for (var i = 17; i < pageLength; i++) { //pageLength
                //console.log("i: " + i);
                needArray3.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        if (needArray2.length === 0) {
            needArray2 = ["No breweries on this page."];
        }

        if (needArray3.length === 0) {
            needArray3 = ["No breweries on this page."];
        }

        const p1 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray)

        const p2 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray2)

        const p3 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray3)

        let pages = [
            p1, p2, p3
        ]

        let emojis = [
            "⬅️",
            "➡️",
        ]

        paginate(foodmessage, pages, emojis, 180000)

    });
    return;
}

function breweriesState(foodmessage) {
    var stateText = brewText.replace("breweries state ", "");
    console.log(stateText);
    var url = `https://api.openbrewerydb.org/breweries?by_state=${stateText}`; //brewery state api
    request(url, function(err, response, body) {
        if (err) {
            console.log('error:', err);
        } else {
            //console.log('body:', body);
        }
        if (response.statusCode >= 400) {
            console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
            if (helper.helperVals.sendMessageToCreator == false) {
                bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                    "It is imperative that this situation gets resolved");
                helper.sendMessageAboutAPI(foodmessage);
                helper.helperVals.sendMessageToCreator = true;
            }
            return;
        } else {
            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
        }
        let parsedData = JSON.parse(body)
        var pageLength = parsedData.length;
        var needArray = [];
        var needArray2 = [];
        var needArray3 = [];
        var greatherThan8 = false;
        var greatherThan17 = false;
        Boolean(greatherThan8);

        console.log("pageLength: " + pageLength);

        if (parsedData.length === 0) {
            foodmessage.channel.send("You may have mistyped something.");
        }

        for (var i = 0; i < pageLength; i++) { //pageLength

            if (i == 8) {
                greatherThan8 = true;
                break;
            }

            needArray.push("**Name: **" + parsedData[i]["name"] + '\n' +
                "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                "**Address: **" + parsedData[i]["street"] + " " +
                parsedData[i]["city"] + " " +
                parsedData[i]["state"] + " " +
                parsedData[i]["postal_code"] + '\n' +
                "**Website: **" + parsedData[i]["website_url"] + '\n' +
                "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
        }

        /********************************/

        if (Boolean(greatherThan8)) {
            //console.log(greatherThan8);
            for (var i = 9; i < pageLength; i++) { //pageLength
                if (i == 17) {
                    greatherThan17 = true;
                    break;
                }
                //console.log("i: " + i);
                needArray2.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        /********************************/

        if (Boolean(greatherThan17)) {
            //console.log(greatherThan8);
            for (var i = 17; i < pageLength; i++) { //pageLength
                //console.log("i: " + i);
                needArray3.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        if (needArray2.length === 0) {
            needArray2 = ["No breweries on this page."];
        }

        if (needArray3.length === 0) {
            needArray3 = ["No breweries on this page."];
        }

        const p1 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray)

        const p2 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray2)

        const p3 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray3)

        let pages = [
            p1, p2, p3
        ]

        let emojis = [
            "⬅️",
            "➡️",
        ]

        paginate(foodmessage, pages, emojis, 180000)

    });
    return;
}


function breweriesZip(foodmessage) {
    var zipText = brewText.replace("breweries zip ", "");
    console.log(zipText);
    var url = `https://api.openbrewerydb.org/breweries?by_postal=${zipText}`; //brewery state api
    request(url, function(err, response, body) {
        if (err) {
            console.log('error:', err);
        } else {
            //console.log('body:', body);
        }
        if (response.statusCode >= 400) {
            console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
            if (helper.helperVals.sendMessageToCreator == false) {
                bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                    "It is imperative that this situation gets resolved");
                helper.sendMessageAboutAPI(foodmessage);
                helper.helperVals.sendMessageToCreator = true;
            }
            return;
        } else {
            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
        }
        let parsedData = JSON.parse(body)
        var pageLength = parsedData.length;
        var needArray = [];
        var needArray2 = [];
        var needArray3 = [];
        var greatherThan8 = false;
        var greatherThan17 = false;
        Boolean(greatherThan8);

        console.log("pageLength: " + pageLength);

        if (parsedData.length === 0) {
            foodmessage.channel.send("You may have mistyped something or no breweries in this zip code.");
        }

        for (var i = 0; i < pageLength; i++) { //pageLength

            if (i == 8) {
                greatherThan8 = true;
                break;
            }

            needArray.push("**Name: **" + parsedData[i]["name"] + '\n' +
                "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                "**Address: **" + parsedData[i]["street"] + " " +
                parsedData[i]["city"] + " " +
                parsedData[i]["state"] + " " +
                parsedData[i]["postal_code"] + '\n' +
                "**Website: **" + parsedData[i]["website_url"] + '\n' +
                "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
        }

        /********************************/

        if (Boolean(greatherThan8)) {
            //console.log(greatherThan8);
            for (var i = 9; i < pageLength; i++) { //pageLength
                if (i == 17) {
                    greatherThan17 = true;
                    break;
                }
                //console.log("i: " + i);
                needArray2.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        /********************************/

        if (Boolean(greatherThan17)) {
            //console.log(greatherThan8);
            for (var i = 17; i < pageLength; i++) { //pageLength
                //console.log("i: " + i);
                needArray3.push("**Name: **" + parsedData[i]["name"] + '\n' +
                    "**Brewery type: **" + parsedData[i]["brewery_type"] + '\n' +
                    "**Address: **" + parsedData[i]["street"] + " " +
                    parsedData[i]["city"] + " " +
                    parsedData[i]["state"] + " " +
                    parsedData[i]["postal_code"] + '\n' +
                    "**Website: **" + parsedData[i]["website_url"] + '\n' +
                    "**Updated at: **" + parsedData[i]["updated_at"] + '\n');
            }
        }

        if (needArray2.length === 0) {
            needArray2 = ["No breweries on this page."];
        }

        if (needArray3.length === 0) {
            needArray3 = ["No breweries on this page."];
        }

        const p1 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray)

        const p2 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray2)

        const p3 = new Discord.MessageEmbed()
            .setColor("0x999999")
            .setDescription(needArray3)

        let pages = [
            p1, p2, p3
        ]

        let emojis = [
            "⬅️",
            "➡️",
        ]

        paginate(foodmessage, pages, emojis, 180000)

    });
    return;
}




bot.on('ready', () => {
    console.log('Gordan Ramsey is mad Commander');
})

bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy