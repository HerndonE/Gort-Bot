const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const filestream = require('fs');
// used for stripping bad text out of user input
const Sanitize = require("../sanitize");
require('dotenv').config();
var token = process.env.TOKEN;
const covidPrefix = '.';
var covidmessage;
const helper = require("../helpers/helper.js");

bot.on('message', covidmessage => {

    let raw_userinput = covidmessage.content.substring(covidPrefix.length)
    let safe_userinput = Sanitize.text(raw_userinput)
    let args = safe_userinput.split(" ");
    var flag, text;
    switch (args[0]) {
        case 'covid':
            const input = args.join(" ");
            console.log(input);

            if (input == null || !isNaN(input)) {
                covidmessage.channel.send("What are you doing?!")
                //console.log("what are you doing?!");
                return;
            } else {
                text = input.replace("covid ", "");
                if (text.includes('country')) {
                    text = text.replace("country ", "").toLocaleLowerCase();
                    //if (isocountries.hasOwnProperty(text)) {
                    //text = isocountries[text];//isocountries[text.toLocaleLowerCase()];
                    if (isocountries.hasOwnProperty(text)) {

                        text = isocountries[text];
                    }
   
                    console.log("1:" + text);
                    /* Old API
                    var url = "https://api.thevirustracker.com/free-api?countryTotal="+ text;
                    */
                    var url = "https://corona-api.com/countries/" + text; //New API
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
                                helper.sendMessageAboutAPI(covidmessage);
                                helper.helperVals.sendMessageToCreator = true;
                            }
                            return;
                        } else {
                            //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                        }
                        let parsedData = JSON.parse(body)

                        /* Old API Case
                        parsedData["results"]
                        */
                        if (parsedData["message"]) {
                            covidmessage.channel.send(parsedData["message"])
                            return;
                        }
                        
                        covidmessage.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setTitle("Covid-19 Country Search!")
                                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/440px-SARS-CoV-2_without_background.png')
                                .setColor("0x999999")
                                /* Old API
                          .setDescription(
`**Country:** ${parsedData["countrydata"][0]["info"].title}
**Total Cases:** ${parsedData["countrydata"][0]["total_cases"]}
**Total Recovered:** ${parsedData["countrydata"][0]["total_recovered"]}
**Total Unresolved:** ${parsedData["countrydata"][0]["total_unresolved"]}
**Total Deaths:** ${parsedData["countrydata"][0]["total_deaths"]}
**Total New Cases Today:** ${parsedData["countrydata"][0]["total_new_cases_today"]}
**Total New Deaths Today:** ${parsedData["countrydata"][0]["total_new_deaths_today"]}
**Total Active Cases:** ${parsedData["countrydata"][0]["total_active_cases"]}
**Total Serious Cases:** ${parsedData["countrydata"][0]["total_serious_cases"]}
**Total Danger Rank:** ${parsedData["countrydata"][0]["total_danger_rank"]}
`)
                        */
                                .setDescription(
                                    `
**Country:** ${parsedData["data"]["name"]}
**Country Code:** ${parsedData["data"]["code"]}
**Population            :** ${parsedData["data"]["population"]}
**Todays Deaths         :** ${parsedData["data"]["today"]["deaths"] }
**Todays Confirmed Cases:** ${parsedData["data"]["today"]["confirmed"]}
**Total Deaths          :** ${parsedData["data"]["latest_data"]["deaths"]}
**Total Confirmed Cases :** ${parsedData["data"]["latest_data"]["confirmed"]}
**Total Recovered Cases :** ${parsedData["data"]["latest_data"]["recovered"]}
**Total Critical Cases  :** ${parsedData["data"]["latest_data"]["critical"]}
**Updated At            :** ${parsedData["data"]["updated_at"]}
`)
                                .setTimestamp()
                                .setFooter('By https://corona-api.com/')

                        });
                    });
                    break;
                }
                switch (text.toLocaleLowerCase()) {
                    case 'about':
                        covidmessage.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setTitle("Covid-19 Tracker Information" + "\n" + "~ Gort Bot")
                                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/440px-SARS-CoV-2_without_background.png')
                                .setColor("0x999999")
                                .setDescription("To learn about current Covid-19 cases " +
                                    "use these commands for more info." + '\n' +
                                    "**USA State Search:**" + '\n' +
                                    "EX: .covid _insert state name/abbrv here_" + '\n' +
                                    "**Country Search:**" + '\n' +
                                    "EX: .covid country _insert country name/abbrv here_" + '\n'
                                )
                                .setTimestamp()
                                .setFooter('By Gort Bot')

                        });
                        return;

                    case 'california':
                    case 'ca':
                        text = 'ca';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/300px-Flag_of_California.svg.png"
                        break;

                    case 'arizona':
                    case 'az':
                        text = 'az';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arizona.svg/300px-Flag_of_Arizona.svg.png"
                        break;

                    case 'alabama':
                    case 'al':
                        text = 'al';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Alabama.svg/300px-Flag_of_Alabama.svg.png"
                        break;

                    case 'alaska':
                    case 'ak':
                        text = 'ak';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Alaska.svg/283px-Flag_of_Alaska.svg.png"
                        break;

                    case 'arkansas':
                    case 'ar':
                        text = 'ar';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arkansas.svg/300px-Flag_of_Arkansas.svg.png"
                        break;

                    case 'colorado':
                    case 'co':
                        text = 'co';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg/301px-Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg.png"
                        break

                    case 'connecticut':
                    case 'ct':
                        text = 'ct';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/259px-Flag_of_Connecticut.svg.png"
                        break;

                    case 'delaware':
                    case 'de':
                        text = 'de';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/300px-Flag_of_Delaware.svg.png"
                        break;

                    case 'florida':
                    case 'fl':
                        text = 'fl';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/300px-Flag_of_Florida.svg.png"
                        break;

                    case 'georgia':
                    case 'ga':
                        text = 'ga';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Georgia_%28U.S._state%29.svg/320px-Flag_of_Georgia_%28U.S._state%29.svg.png"
                        break;

                    case 'hawaii':
                    case 'hi':
                        text = 'hi';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Hawaii.svg/360px-Flag_of_Hawaii.svg.png"
                        break;

                    case 'idaho':
                    case 'id':
                        text = 'id';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/254px-Flag_of_Idaho.svg.png"
                        break;

                    case 'illinois':
                    case 'il':
                        text = 'il';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/334px-Flag_of_Illinois.svg.png"
                        break;

                    case 'indiana':
                    case 'in':
                        text = 'in';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Indiana.svg/300px-Flag_of_Indiana.svg.png"
                        break;

                    case 'iowa':
                    case 'ia':
                        text = 'ia';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/300px-Flag_of_Iowa.svg.png"
                        break;

                    case 'kansas':
                    case 'ks':
                        text = 'ks';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/334px-Flag_of_Kansas.svg.png"
                        break;

                    case 'kentucky':
                    case 'ky':
                        text = 'ky';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/360px-Flag_of_Kentucky.svg.png"
                        break;

                    case 'louisiana':
                    case 'la':
                        text = 'la';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/315px-Flag_of_Louisiana.svg.png"
                        break;

                    case 'maine':
                    case 'me':
                        text = 'me';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/254px-Flag_of_Maine.svg.png"
                        break;

                    case 'maryland':
                    case 'md':
                        text = 'md';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Maryland.svg/300px-Flag_of_Maryland.svg.png"
                        break;

                    case 'massachusetts':
                    case 'ma':
                        text = 'ma';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/334px-Flag_of_Massachusetts.svg.png"
                        break;

                    case 'michigan':
                    case 'mi':
                        text = 'mi';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/300px-Flag_of_Michigan.svg.png"
                        break;

                    case 'minnesota':
                    case 'mn':
                        text = 'mn';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/315px-Flag_of_Minnesota.svg.png"
                        break;

                    case 'mississippi':
                    case 'ms':
                        text = 'ms';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/FIAV_noflag.svg/307px-FIAV_noflag.svg.png"
                        break;

                    case 'missouri':
                    case 'mo':
                        text = 'mo';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/343px-Flag_of_Missouri.svg.png"
                        break;

                    case 'montana':
                    case 'mt':
                        text = 'mt';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/300px-Flag_of_Montana.svg.png"
                        break;

                    case 'nebraska':
                    case 'ne':
                        text = 'ne';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/334px-Flag_of_Nebraska.svg.png"
                        break;

                    case 'nevada':
                    case 'nv':
                        text = 'nv';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/300px-Flag_of_Nevada.svg.png"
                        break;

                    case 'new hampshire':
                    case 'nh':
                        text = 'nh';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/300px-Flag_of_New_Hampshire.svg.png"
                        break;

                    case 'new jersey':
                    case 'nj':
                        text = 'nj';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/333px-Flag_of_New_Jersey.svg.png"
                        break;

                    case 'new mexico':
                    case 'nm':
                        text = 'nm';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_New_Mexico.svg/300px-Flag_of_New_Mexico.svg.png"
                        break;

                    case 'new york':
                    case 'ny':
                        text = 'ny';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/360px-Flag_of_New_York.svg.png"
                        break;

                    case 'north carolina':
                    case 'nc':
                        text = 'ns';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_North_Carolina.svg/300px-Flag_of_North_Carolina.svg.png"
                        break;

                    case 'north dakota':
                    case 'nd':
                        text = 'nd';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/256px-Flag_of_North_Dakota.svg.png"
                        break;

                    case 'ohio':
                    case 'oh':
                        text = 'oh';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Ohio.svg/325px-Flag_of_Ohio.svg.png"
                        break;

                    case 'oklahoma':
                    case 'ok':
                        text = 'ok';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/300px-Flag_of_Oklahoma.svg.png"
                        break;

                    case 'oregon':
                    case 'or':
                        text = 'or';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/334px-Flag_of_Oregon.svg.png"
                        break;

                    case 'pennsylvania':
                    case 'pa':
                        text = 'pa';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/300px-Flag_of_Pennsylvania.svg.png"
                        break;

                    case 'rhode island':
                    case 'ri':
                        text = 'ri';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Rhode_Island.svg/228px-Flag_of_Rhode_Island.svg.png"
                        break;

                    case 'south carolina':
                    case 'sc':
                        text = 'sc';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/300px-Flag_of_South_Carolina.svg.png"
                        break;

                    case 'south dakota':
                    case 'sd':
                        text = 'sd';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/320px-Flag_of_South_Dakota.svg.png"
                        break;

                    case 'tennessee':
                    case 'tn':
                        text = 'tn';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Tennessee.svg/334px-Flag_of_Tennessee.svg.png"
                        break;

                    case 'texas':
                    case 'tx':
                        text = 'tx';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Texas.svg/300px-Flag_of_Texas.svg.png"
                        break;

                    case 'utah':
                    case 'ut':
                        text = 'ut';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Flag_of_the_State_of_Utah.svg/334px-Flag_of_the_State_of_Utah.svg.png"
                        break;

                    case 'vermont':
                    case 'vt':
                        text = 'vt';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/334px-Flag_of_Vermont.svg.png"
                        break;

                    case 'virginia':
                    case 'va':
                        text = 'va';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/292px-Flag_of_Virginia.svg.png"
                        break;

                    case 'washington':
                    case 'wa':
                        text = 'wa';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/337px-Flag_of_Washington.svg.png"
                        break;

                    case 'west virginia':
                    case 'wv':
                        text = 'wv';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/360px-Flag_of_West_Virginia.svg.png"
                        break;

                    case 'wisconsin':
                    case 'wi':
                        text = 'wi';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/300px-Flag_of_Wisconsin.svg.png"
                        break;

                    case 'wyoming':
                    case 'wy':
                        text = 'wy';
                        flag = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Wyoming.svg/286px-Flag_of_Wyoming.svg.png"
                        break;
                }

            }

            //`https://api.thevirustracker.com/free-api?countryTotal=US`,
            var url = "https://covidtracking.com/api/v1/states/" + text + "/current.json" //'https://covidtracking.com/api/states";
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
                        helper.sendMessageAboutAPI(chucknorrismessage);
                        helper.helperVals.sendMessageToCreator = true;
                    }
                    return;
                } else {
                    //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" .Status:✔️");
                }
                let parsedData = JSON.parse(body)

                if (parsedData["error"]) {
                    covidmessage.channel.send("You may have mistyped something.")
                    return;
                }

                covidmessage.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle("Covid-19 State Search!")
                        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/440px-SARS-CoV-2_without_background.png')
                        .setColor("0x999999")
                        .setDescription(
                            `**State:** ${parsedData['state']}
**Positive:** ${parsedData['positive']}
**Negative:** ${parsedData['negative']}
**Hospitilized Currently:** ${parsedData['hospitalizedCurrently']}
**Hospitilized Cumulative:** ${parsedData['hospitalizedCumulative']}
**On Ventilator Currently:** ${parsedData['onVentilatorCurrently']}
**On Ventilator Cumulative:** ${parsedData['onVentilatorCumulative']}
**Recovered:** ${parsedData['recovered']}
**Data Quality Grade:** ${parsedData['created']}
**deaths:** ${parsedData['death']}
**Hospitilized:** ${parsedData['hospitalized']}
**Last Updated:** ${parsedData['lastUpdateEt']}
`)
                        .setImage(flag)
                        .setTimestamp()
                        .setFooter('By https://covidtracking.com/api')

                });
            });
            break;
    }


})


var isocountries = {

    "afghanistan": "af",
    "aland islands": "ax",
    "albania": "al",
    "algeria": "dz",
    "american samoa": "as",
    "andorra": "ad",
    "angola": "ao",
    "anguilla": "ai",
    "antarctica": "aq",
    "antigua and barbuda": "ag",
    "argentina": "ar",
    "armenia": "am",
    "aruba": "aw",
    "australia": "au",
    "austria": "at",
    "azerbaijan": "az",
    "bahamas": "bs",
    "bahrain": "bh",
    "bangladesh": "bd",
    "barbados": "bb",
    "belarus": "by",
    "belgium": "be",
    "belize": "bz",
    "benin": "bj",
    "bermuda": "bm",
    "bhutan": "bt",
    "bolivia": "bo",
    "bosnia and herzegovina": "ba",
    "botswana": "bw",
    "bouvet island": "bv",
    "brazil": "br",
    "british indian ocean territory": "io",
    "brunei darussalam": "bn",
    "bulgaria": "bg",
    "burkina faso": "bf",
    "burundi": "bi",
    "cambodia": "kh",
    "cameroon": "cm",
    "canada": "ca",
    "cape verde": "cv",
    "cayman islands": "ky",
    "central african republic": "cf",
    "chad": "td",
    "chile": "cl",
    "china": "cn",
    "christmas island": "cx",
    "cocos (keeling) islands": "cc",
    "colombia": "co",
    "comoros": "km",
    "congo": "cg",
    "congo, democratic republic": "cd",
    "cook islands": "ck",
    "costa rica": "cr",
    "cote d'ivoire": "ci",
    "croatia": "hr",
    "cuba": "cu",
    "cyprus": "cy",
    "czech republic": "cz",
    "denmark": "dk",
    "djibouti": "dj",
    "dominica": "dm",
    "dominican republic": "do",
    "ecuador": "ec",
    "egypt": "eg",
    "el salvador": "sv",
    "equatorial guinea": "gq",
    "eritrea": "er",
    "estonia": "ee",
    "ethiopia": "et",
    "falkland islands (malvinas)": "fk",
    "faroe islands": "fo",
    "fiji": "fj",
    "finland": "fi",
    "france": "fr",
    "french guiana": "gf",
    "french polynesia": "pf",
    "french southern territories": "tf",
    "gabon": "ga",
    "gambia": "gm",
    "georgia": "ge",
    "germany": "de",
    "ghana": "gh",
    "gibraltar": "gi",
    "greece": "gr",
    "greenland": "gl",
    "grenada": "gd",
    "guadeloupe": "gp",
    "guam": "gu",
    "guatemala": "gt",
    "guernsey": "gg",
    "guinea": "gn",
    "guinea-bissau": "gw",
    "guyana": "gy",
    "haiti": "ht",
    "heard island & mcdonald islands": "hm",
    "holy see (vatican city state)": "va",
    "honduras": "hn",
    "hong kong": "hk",
    "hungary": "hu",
    "iceland": "is",
    "india": "in",
    "indonesia": "id",
    "iran, islamic republic of": "ir",
    "iraq": "iq",
    "ireland": "ie",
    "isle of man": "im",
    "israel": "il",
    "italy": "it",
    "jamaica": "jm",
    "japan": "jp",
    "jersey": "je",
    "jordan": "jo",
    "kazakhstan": "kz",
    "kenya": "ke",
    "kiribati": "ki",
    "korea": "kr",
    "kuwait": "kw",
    "kyrgyzstan": "kg",
    "lao people's democratic republic": "la",
    "latvia": "lv",
    "lebanon": "lb",
    "lesotho": "ls",
    "liberia": "lr",
    "libyan arab jamahiriya": "ly",
    "liechtenstein": "li",
    "lithuania": "lt",
    "luxembourg": "lu",
    "macao": "mo",
    "macedonia": "mk",
    "madagascar": "mg",
    "malawi": "mw",
    "malaysia": "my",
    "maldives": "mv",
    "mali": "ml",
    "malta": "mt",
    "marshall islands": "mh",
    "martinique": "mq",
    "mauritania": "mr",
    "mauritius": "mu",
    "mayotte": "yt",
    "mexico": "mx",
    "micronesia, federated states of": "fm",
    "moldova": "md",
    "monaco": "mc",
    "mongolia": "mn",
    "montenegro": "me",
    "montserrat": "ms",
    "morocco": "ma",
    "mozambique": "mz",
    "myanmar": "mm",
    "namibia": "na",
    "nauru": "nr",
    "nepal": "np",
    "netherlands": "nl",
    "netherlands antilles": "an",
    "new caledonia": "nc",
    "new zealand": "nz",
    "nicaragua": "ni",
    "niger": "ne",
    "nigeria": "ng",
    "niue": "nu",
    "norfolk island": "nf",
    "northern mariana islands": "mp",
    "norway": "no",
    "oman": "om",
    "pakistan": "pk",
    "palau": "pw",
    "palestinian territory, occupied": "ps",
    "panama": "pa",
    "papua new guinea": "pg",
    "paraguay": "py",
    "peru": "pe",
    "philippines": "ph",
    "pitcairn": "pn",
    "poland": "pl",
    "portugal": "pt",
    "puerto rico": "pr",
    "qatar": "qa",
    "reunion": "re",
    "romania": "ro",
    "russian federation": "ru",
    "rwanda": "rw",
    "saint barthelemy": "bl",
    "saint helena": "sh",
    "saint kitts and nevis": "kn",
    "saint lucia": "lc",
    "saint martin": "mf",
    "saint pierre and miquelon": "pm",
    "saint vincent and grenadines": "vc",
    "samoa": "ws",
    "san marino": "sm",
    "sao tome and principe": "st",
    "saudi arabia": "sa",
    "senegal": "sn",
    "serbia": "rs",
    "seychelles": "sc",
    "sierra leone": "sl",
    "singapore": "sg",
    "slovakia": "sk",
    "slovenia": "si",
    "solomon islands": "sb",
    "somalia": "so",
    "south africa": "za",
    "south georgia and sandwich isl.": "gs",
    "spain": "es",
    "sri lanka": "lk",
    "sudan": "sd",
    "suriname": "sr",
    "svalbard and jan mayen": "sj",
    "swaziland": "sz",
    "sweden": "se",
    "switzerland": "ch",
    "syrian arab republic": "sy",
    "taiwan": "tw",
    "tajikistan": "tj",
    "tanzania": "tz",
    "thailand": "th",
    "timor-leste": "tl",
    "togo": "tg",
    "tokelau": "tk",
    "tonga": "to",
    "trinidad and tobago": "tt",
    "tunisia": "tn",
    "turkey": "tr",
    "turkmenistan": "tm",
    "turks and caicos islands": "tc",
    "tuvalu": "tv",
    "uganda": "ug",
    "ukraine": "ua",
    "united arab emirates": "ae",
    "united kingdom": "gb",
    "united states": "us",
    "united states outlying islands": "um",
    "uruguay": "uy",
    "uzbekistan": "uz",
    "vanuatu": "vu",
    "venezuela": "ve",
    "viet nam": "vn",
    "virgin islands, british": "vg",
    "virgin islands, u.s.": "vi",
    "wallis and futuna": "wf",
    "western sahara": "eh",
    "yemen": "ye",
    "zambia": "zm",
    "zimbabwe": "zw"
};


bot.on('ready', () => {
    console.log('Covid Tracker is Ready Commander');
})


bot.login(token); //For Local Testing
//bot.login(process.env.token); //For Online Deploy