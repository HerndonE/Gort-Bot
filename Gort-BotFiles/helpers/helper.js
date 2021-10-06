const { Message } = require('discord.js');
const request = require('request');
var message;

var helperVals ={
  sendMessageToCreator : false,
  message 
}

function sendMessageAboutAPI(message){
  message.reply("Thank you for trying out this feature, it seems that this feature is no longer working. I have pinged my creator to resolve this matter.");
}

exports.helperVals = helperVals;
exports.sendMessageAboutAPI = sendMessageAboutAPI;

