var fs = require('fs');
var f = 'write.json';


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('introduction.txt')
});

lineReader.on('line', function (line) {
  var element = {
    "heading": line,
    "content": "content-text",
    "sub": []
  };


  //console.log(line);

  var tempStr = '{"id" : "' + guid() + '", "heading" : "' + line + '", "content" : "", "sub" : [] }, \n';

  var fullStr = line.replace(line, tempStr);
  var fullStr1 = fullStr.replace(/\t/g, ' ');
  //console.log(fullStr);
  //writeData(fullStr1);



  var count = (line.match(/\t/g) || []).length;
  //console.log(count + '= ' + line);
});




function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}



function writeData(data) {

  fs.appendFile(f, data, function (err) {
    if (err)
      console.error(err);
    console.log('Appended!');
  });



}


  function addNode(parentNode, element) {
  parentNode.sub.push(element);
  return parentNode;
}
var masterNode = {
  "id" : "m123",
  "heading": "master",
  "content": "content-text",
  "sub": []
};

var element = {
  "heading": "line",
  "content": "content-text",
  "sub": []
};
var pid = addNode(masterNode, element);
console.log(pid);
