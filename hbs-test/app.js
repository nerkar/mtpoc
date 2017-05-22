var fs = require('fs');

var file = fs.createReadStream('file1.txt');
var wStream = fs.createWriteStream('e:/images/file2.txt');


file.pipe(wStream);