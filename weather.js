const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("./sanitize");
const weatherPREFIX = '.';
var weathermessage;
var Index = require('./index');
var token = Index.token;
var openweathermapMessage = "Brought to you by openweathermap.org";
bot.on('message', weathermessage => {


    let raw_userinput = weathermessage.content.substring(weatherPREFIX.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");

    switch (args[0]) {
        case 'weather':
            var check = (args[1]);

            if (typeof check === 'undefined') {

                return weathermessage.reply('Error! Please enter City or Zip Code')

            }
            var c2 = check.concat(' ', args[2]);


            if ((c2 != null)) {

                if (c2.indexOf("undefined") || !c2.indexOf("undefined")) {
                    c2 = c2.replace(' undefined', '');

                    var apiKey = 'YOURAPIKEY';
                    let city = c2;
                    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

                }

                if (!isNaN(c2)) {
                    let zip = c2;
                    url = `http://api.openweathermap.org/data/2.5/weather?q=${zip},us&appid=${apiKey}&units=imperial`
                }



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
                    var weatherIcon = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
                    weathermessage.channel.send({
                        embed: {

                            color: 0x999999,
                            title: 'Current Weather Report \n ~ Gort Bot',
                            thumbnail: {
                                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_k76-s3pPH7ORxG6lI4c6c0fVskmLICRX0zNLJ4Ouns_eEeJnlc88I4Aok2BXJM-x_nVZaedZ&usqp=CAc',
                            },
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

//bot.login(token);//For Local Testing
bot.login(process.env.token); //For Online Deploy