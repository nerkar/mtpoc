var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var mkdirp = require('mkdirp');
var promise = require('bluebird');
var hashmap = require('hashmap');
var cheerio = require('cheerio');
var source = "<h1> {{pageName}} </h1> <p> {{pageStyleReducedContent}} </p>";
var template = handlebars.compile(source, { noEscape: true });



//function definition
var compileData = function (template, obj, currentDir) {

  return new promise(function (resolve, reject) {

    var fullpath = "";

    if (obj.length) {
      obj.forEach(function (item, index) {
        fullpath = path.join(currentDir, item.pageName).replace(' ', '_');
        if (item.sub.length > 0) {
          compileData(template, item.sub, fullpath);
        }



        var trackingData = {
          "pageName": item.pageName,
          "pageId": item.pageId,
          "pageContentLength": item.pageStyleReducedContent.length
        }
        
        var result = template(item);
        writeHtml(fullpath, result, 'page.html');

        writeHtml(fullpath, JSON.stringify(trackingData), 'debug.txt');
        resolve();
      });


    }

  })
}

var processImages = function (template, obj, currentDir) {

  return new promise(function (resolve, reject) {

    var fullpath = "";

    if (obj.length) {
      obj.forEach(function (item, index) {
        fullpath = path.join(currentDir, item.pageName).replace(' ', '_');
        if (item.sub.length > 0) {
          processImages(template, item.sub, fullpath);
        }

        getImageHash(item.pageStyleReducedContent).then(function (mapArray) {

          if (mapArray.count() > 0) {
            mapArray.forEach(function (value, index) {
              var filename = 'E:/mindtouch/new_approach/mtpoc/hbs-test/data/nokia/' + index;

              fs.access(filename, function (error) {
                if (error) {
                  console.log('not found ----- ' + filename);
                }
                else {
                  var stats = fs.statSync(filename);
                  var rStream = fs.createReadStream(filename);
                  var wStream = fs.createWriteStream(fullpath + '/' + index);
                  //var wStream = fs.createWriteStream('e:/images/' + '/' + index);
                  rStream.pipe(wStream);

                  rStream.on('error', function (error) {
                    console.log(error);
                    reject();
                  })                   
                }
              })
            })
          }
        })                 
        resolve();
      });


    }

  })
}

var writeHtml = function (pathName, data, filename) {
  makeDirectories(pathName, function (p) {
    var writerStream = fs.createWriteStream(path.join(p, filename));

    writerStream.write(data, 'UTF8');

    writerStream.end();

    writerStream.on('finish', function () {
      console.log('writing finished');
    });

    writerStream.on('error', function (err) {
      console.log(err);
    });
  });
}

var makeDirectories = function (pth, callback) {
  if (!fs.existsSync(pth)) {
    mkdirp(pth, function (err) {
      if (err) console.error(err)
      else
        return callback(pth);
    });
  }
}


var readJSON = function (filename, callback) {

  var data = '';
  // Create a readable stream
  var readerStream = fs.createReadStream(filename);

  // Set the encoding to be utf8. 
  readerStream.setEncoding('UTF8');

  // Handle stream events --> data, end, and error
  readerStream.on('data', function (chunk) {
    data += chunk;
  });

  readerStream.on('end', function () {
    //console.log(data);
    callback(data);
  });

  readerStream.on('error', function (err) {
    console.log(err.stack);
  });
}

function getEditTime() {
  var curDate = new Date().toISOString().substr(0, 19).replace('T', ' ');
  curDate = curDate.replace(/[&\/\\#,+()$~%-.'":*?<>{}]/g, '');
  return curDate.replace(" ", '');
}

function getImageHash(text) {
  return new promise(function (resolve) {

    var mapArray = new hashmap();
    $ = cheerio.load(text);

    $('img').each(function () {
      //console.log($(this).attr('src'));
      mapArray.set($(this).attr('src'), {});
    });
    resolve(mapArray);
  })
}

function progress(count, msg) {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(count + msg);
}

function doubleEncode(str) {
  return urlencode(urlencode(str))
}

// calling functions
//var file = require('./input2.json');
//compileData(template, file, __dirname);

var file = require('./nokia.json');
compileData(template, file, './processed/');
//processImages(template, file, './processed/');

