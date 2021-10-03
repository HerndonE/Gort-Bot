//https://stackoverflow.com/questions/45932650/how-to-check-if-a-url-or-a-webservice-is-alive-in-nodejs
const request = require('request');

function checkurl(url){
request(url , function (error, response, body) {

  if(error){
    console.log('Error: '+ error);
    return;
  }
  
  if(response.statusCode >= 400) {//Numbers are set accordingly to Status Codes: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
    console.log('API: ' + url + ' has a status code of ' + response.statusCode + " Status:❌" );
    return;

}
else {
  //console.log('API: ' + url + ' has a status code of ' + response.statusCode +" Status:✔️");
  //return;
}
 
});

}

exports.checkurl = checkurl;