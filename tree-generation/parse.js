var promise = require('bluebird');
var request = require('request');
var urlencode = require('urlencode');

// module to generate content tree with basic info and content it contains.


var readFile = promise.promisify(require("fs").readFile);

readFile("pages.json", "utf8").then(function (contents) {
  return eval(contents);
}).then(function (result) {
  iterate(result, "");
}).catch(SyntaxError, function (e) {
  console.log("File had syntax error", e);
  //Catch any other error
}).catch(function (e) {
  console.log("Error reading file", e);
});


function iterate(arr, endPointPath) {
  return promise.all(arr.map(function (singleURL) {
    return generateTree(singleURL, endPointPath + "/" + singleURL.pageName);
  }));
}

function generateTree(page, endpointPath) {

  var result = endpointPath.replace("/", "");
  var endpoint = "https://efm-sandbox.mindtouch.us/@api/deki/pages/=" + doubleEncode(result) + "/contents?edittime=" + getEditTime();

  request.post({
    url: endpoint,
    auth: { user: 'admin', pass: 'M1nt0uch' },
    form: page.pageContent,
    headers: {
      'Content-type': 'text/html'
    }
  }, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log('responseCode = ' + response.statusCode);
      console.log(body);
      if (response.statusCode !== 200) {
        console.log('responseCode = ' + response.statusCode);
        console.log(body);
      }
    }
  });

  if (page.sub.length) {
    iterate(page.sub, endpointPath);
  }
}

function doubleEncode(str) {
  return urlencode(urlencode(str))
}

function getEditTime() {
  var curDate = new Date().toISOString().substr(0, 19).replace('T', ' ');
  curDate = curDate.replace(/[&\/\\#,+()$~%-.'":*?<>{}]/g, '');
  return curDate.replace(" ", '');
}
