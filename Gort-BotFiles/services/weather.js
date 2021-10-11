const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
const weatherPREFIX = '.';
var weathermessage;
var openweathermapMessage = "Brought to you by openweathermap.org";
const helper = require("../helpers/helper.js");

bot.on('message', weathermessage => {
   
    let raw_userinput = weathermessage.content.substring(weatherPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    
    switch (args[0]) {
        case 'weather':
            var check = (args[1]);
            //var check3 = (args[1]);
            if (typeof check === 'undefined')
            {
                //console.log("User didn't enter anything");
                return weathermessage.reply('Error! Please enter City or Zip Code')
                
            }
            var c2 = check.concat(' ', args[2]);
            //check3.trim();
            
            if ((c2 != null)) {
                //console.log(c2);
                //console.log(check3);
                if (c2.indexOf("undefined") || !c2.indexOf("undefined")) {
                    c2 = c2.replace(' undefined', '');
                    //console.log(c2);
                    //test = true;
                    //console.log(true);
                    
                    var apiKey = process.env.WEATHER_APIKEY;
                    let city = c2;
                    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
                    
                }
                
                if (!isNaN(c2)) 
                {
                    let zip = c2;
                    url = `http://api.openweathermap.org/data/2.5/weather?q=${zip},us&appid=${apiKey}&units=imperial`
                }

                //weathermessage.channel.send('You just typed: ' + args[1])

                request(url, function(err, response, body) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        console.log('body:', body);
                        if (body == '{"cod":"404","message":"city not found"}') {
                            //console.log('wow');
                            weathermessage.channel.send("City not found! Try again!")
                            return;
                        }
                    }
                    if (response.statusCode >= 400) {
                        console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌");
                        if (helper.helperVals.sendMessageToCreator == false) {
                            bot.users.cache.get("YOURIDHERE").send("Hello Commander, intelligence reports reveal that " + 'API: ' + url + ' has a status code of ' + response.statusCode + " .Status:❌" + '\n' +
                                "It is imperative that this situation gets resolved");
                            helper.sendMessageAboutAPI(weathermessage);
                            helper.helperVals.sendMessageToCreator = true;
                        }
                        return;
                    } else {
                        //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                    }
                    let weather = JSON.parse(body)
                    var sunset = weather.sys.sunset;
                    var newSunset = new Date(sunset * 1000);
                    var sunrise = weather.sys.sunrise;
                    var newSunrise = new Date(sunrise * 1000);
                    let message = `The weather in **${weather.name}, ${weather.sys.country}** is **${weather.weather[0].main}** 
**Description:** ${weather.weather[0].description}
**🌡:** ${weather.main.temp}F
**Max 🌡:** ${weather.main.temp_max}F
**Feels Like:** ${weather.main.feels_like}F
**Humidity 💧:** ${weather.main.humidity}
**Wind 💨:** ${weather.wind.speed}mph
**Pressure:** ${weather.main.pressure}mb
**🌄:** ${newSunrise.toLocaleString()} UTC/GMT.
**🌇:** ${newSunset.toLocaleString()} UTC/GMT.
                   `;
                    //weathermessage.channel.send(message)
 var weatherIcon = "http://openweathermap.org/img/wn/" + weather.weather[0].icon +"@2x.png";
 weathermessage.channel.send({
                            embed: {
                                  
                                color: 0x999999,
	                            title: 'Current Weather Report \n ~ Gort Bot',
                                description: message,
                                image: {
                                    url: weatherIcon
                                },
                                footer: {
		                            text: openweathermapMessage,
	                                },
                            }
                        });
                    console.log(message);
                    //weathermessage.channel.send("Brought to you by " + "openweathermap.org");
                });

            } else {
                weathermessage.channel.send('come again?!')
            }
            break;
    }
})

bot.on('ready', () => {
    console.log('Weather Function is Ready Commander');
})


bot.login(token);//For Local Testing
//bot.login(process.env.token); //For Online Deploy