var fs = require('fs');var file = require('./temp.json');var BigNode = {};function extract(page) {
  if (page === undefined) {
    console.log('undefined data')
  }  else {    //console.log('exist data');    //console.log(page.subpages.page.length);    //console.log(page.subpages.page[2].subpages);    //    console.log(typeof( page.subpages.page[2].subpages));    if (Array.isArray(page.subpages.page)) {
      console.log(page.subpages.page.length);      page.subpages.page.forEach(function (item, index) {
        console.log(item.title);        extract(item);
      });
    }  }
}extract(file.page);