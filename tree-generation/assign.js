var promise = require('bluebird');
var request = require('request');
var urlencode = require('urlencode');

// module to assign template type to each node in tree

var readFile = promise.promisify(require("fs").readFile);

readFile("outputJSON.json", "utf8").then(function (contents) {
//readFile(process.argv[2], "utf8").then(function (contents) {
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
  var tagValue = getTemplateTag(page.templateType);
  var endpoint = "https://efm-sandbox.mindtouch.us/@api/deki/pages/=" + doubleEncode(result) + "/tags";

  request({
    url: endpoint,
    auth: { user: 'admin', pass: 'M1nt0uch' },
    body: tagValue,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/xml'
    }
  }, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    else {
//      console.log('responseCode = ' + response.statusCode);
      //console.log(body);
      if (response.statusCode === 200) {
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


function getTemplateTag(templateValue) {
  var result = "";
  if (templateValue) {
    switch (templateValue) {
      case "article:topic-category": result = "<tags><tag value=\"article:topic-category\" /></tags>";
        break;
      case "article:topic-guide": result = "<tags><tag value=\"article:topic-guide\" /></tags>";
        break;
      case "article:reference": result = "<tags><tag value=\"article:reference\" /></tags>";
        break;
      case "article:howto": result = "<tags><tag value=\"article:howto\" /></tags>";
        break;
      case "article:portfolio": result = "<tags><tag value=\"article:portfolio\" /></tags>";
        break;
      default: result = "<tags><tag value=\"article:topic\" /></tags>";
    }
  }
  else {
    result = "<tags><tag value=\"article:topic\" /></tags>";
  }
  return result;
}
