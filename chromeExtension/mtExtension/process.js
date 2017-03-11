var promise = require('bluebird');
var request = require('request');
 


var readFile = promise.promisify(require("fs").readFile);

readFile("outputJSON.json", "utf8").then(function (contents) {
  return  eval(contents);
}).then(function (result) {
  
  iterate(result);
  //console.log("The result of evaluating myfile.js", result);

}).catch(SyntaxError, function (e) {
  console.log("File had syntax error", e);
  //Catch any other error
}).catch(function (e) {
  console.log("Error reading file", e);
});

function iterate(arr) {
  return promise.all(arr.map(function (singleURL) {
    return checkStatusCode(singleURL);
  }));
}



function checkStatusCode(page) {
  request.post({
    //url: 'http://local.tiresplus.com/location/533394//'
    url: page.endpoint,
    auth: { user: 'admin', pass: 'M1nt0uch' },
    form: page.content,
    headers: {
      'Content-type'  : 'text/html'
    }
      }, (error, response, body) => {
    if (error) {      
      console.log(error);
    }
    else {
      console.log('responseCode = ' + response.statusCode);
      if (response.statusCode !== 200) {
//        console.log('responseCode :   ' + response.statusCode + '    ' + page.endpoint);
//        console.log(response);
        //callback('responseCode :   ' + response.statusCode + '    ' + uri);
      }
    }

  });
}