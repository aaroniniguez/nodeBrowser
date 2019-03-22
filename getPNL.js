const twitter = require("twitter");
const facebook = require("facebook");
const tefs = require("tefs");
let rawdata = require('fs').readFileSync('secret.json');  
var tefsCredentials = JSON.parse(rawdata).TEFS; 
var twitterCredentials = JSON.parse(rawdata).Twitter;
var twitterCredentialsPromo = JSON.parse(rawdata).TwitterPromo;
var facebookCredentials = JSON.parse(rawdata).Facebook
tefs.tefs(tefsCredentials.username, tefsCredentials.password).then(data => 
{
	twitter.postOnTwitter(twitterCredentials.username, twitterCredentials.password, data + "\n\n #tefs #TradeNet #suretrader", "dailyPNL.png");
	facebook.postOnFacebook(facebookCredentials.username, facebookCredentials.password, data, "dailyPNL.png");
}).catch(function(error){
	console.log(error);	
})
