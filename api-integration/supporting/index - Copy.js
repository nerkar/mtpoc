//  url: 'https://success.mindtouch.com/@api/deki/pages/home/info',
// retrieve content tree
// https://efm-sandbox.mindtouch.us/@api/deki/pages/=Compuware/tree
// to get properties of pages
//url: 'https://success.mindtouch.com/@api/deki/pages/home/properties',

var fs = require('fs');
// API Token key and secret are available from control panel when API token is generated
const key = '29b005cdbc47b710fae6e0859c0e35e73cb716702abe9336beee2a7cc847842b';
const secret = '6350d693f3c4938628bc5d199a900102e11fd88fb99aeeee536b91fe07e3367f';

// Hash time and key with secret
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', secret);
const epoch = Math.floor(Date.now() / 1000);
hmac.update(`${key}${epoch}`);
const hash = hmac.digest('hex');
const token = `${key}_${epoch}_${hash}`;

// send token as X-Deki-Client HTTP header to MindTouch API (https://github.com/request/request is used in this example)
const request = require('request');
request({  
  url: 'https://success.mindtouch.com/@api/deki/pages/home/properties',
  headers: {
    'X-Deki-Token': token
    
  }
}, (error, response, body) => {

  //console.log(error);
  //console.log(response);
		console.log('responseCode = ' + response.statusCode  +  '\n' + body);
	var wr = fs.createWriteStream('temp.json');
		wr.write(body);		
 
});

