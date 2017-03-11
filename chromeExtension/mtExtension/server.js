var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/contextmenu.html");
});

app.get('/test', function (req, res) {
  res.sendFile(__dirname + "/post.html");
});
app.post('/login', function (req, res) {
  var user_name = req.body.user;
  var password = req.body.password;
  console.log("User name = " + user_name + ", password is " + password);
  res.end("yes");
});

app.post('/test', function (req, res) {
  console.log('post hit');
  var body = req.body;
  console.log(body);
  var jsonData = JSON.stringify(body);
  writeData(jsonData + ',');
  res.end("yes");
});


app.listen(3545, function () {
  console.log("Started on PORT 3545");
})

var writeData = function (data) {
  var writerStream = fs.createWriteStream('outputJSON.json', { flags : 'a' } );

  writerStream.write(data, 'UTF8');

  writerStream.end();

  writerStream.on('finish', function () {
    console.log('writing finished');
  });

  writerStream.on('error', function (err) {
    console.log(err.stack);
  });
  console.log('program end........');
}