var selectedContent;
var MenuRecord;
var endPoint1 = "https://efm-sandbox.mindtouch.us/@api/deki/pages/";
var endPoint2 = "/contents?edittime=";
var items = [];
var contentid;
var contentval;

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {

} else {
  alert('The File APIs are not fully supported in this browser.');
}
$(document).ready(function () {


  if ($("#test").addEventListener) {
    $("#test").addEventListener('contextmenu', function (e) {
      alert("You've tried to open context menu"); //here you draw your own menu
      e.preventDefault();
    }, false);
  } else {

    //document.getElementById("test").attachEvent('oncontextmenu', function() {
    //$(".test").bind('contextmenu', function() {
    $('body').on('contextmenu', '.test', function (event) {
      //alert("contextmenu"+event);
      document.getElementById("rmenu").className = "show";
      document.getElementById("rmenu").style.top = mouseY(event) + 'px';
      document.getElementById("rmenu").style.left = mouseX(event) + 'px';
      event.preventDefault();


    });
  }
  $("#rmenu ul li a").on("click", function () {
    
    storeContentToIndexJson(MenuRecord, $(this).attr("id"), selectedContent);
  });

  $("#postJson").on("click", function () {
  
    var curDate = new Date().toISOString().substr(0, 19).replace('T', ' ');
    curDate=  curDate.replace(/[&\/\\#,+()$~%-.'":*?<>{}]/g, '');
   
    var actualEndPoint = endPoint1 + contentid + endPoint2 + curDate.replace(" ",'');

    // var postData = JSON.stringify(MenuRecord);

    $.ajax({
      type: "POST",
      url: actualEndPoint,
     // contentType: 'text/html',
      auth: {
        //'Authorization': 'Basic xxxxxxxxxxxxx',
        'user': 'admin',
        'pass': 'M1nt0uch',
        //'contentType': 'text/html'
      },
      data: contentval,
      success: function () {
        console.log("data post successfully");
      },
      dataType: "text",
      error: function (error) {
        console.log(error.statusText);
        }
    });


    //requestData(endPoint, function (MenuRecord) { });

    //requestData("http://localhost:3545/test", function(data) { 
    //    alert(data);
    //});
    // requestData

  });
});

// this is from another SO post...
$(document).bind("click", function (event) {
  document.getElementById("rmenu").className = "hide";
});



function mouseX(evt) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return evt.clientX + (document.documentElement.scrollLeft ?
        document.documentElement.scrollLeft :
        document.body.scrollLeft);
  } else {
    return null;
  }
}

function mouseY(evt) {
  if (evt.pageY) {
    return evt.pageY;
  } else if (evt.clientY) {
    return evt.clientY + (document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop);
  } else {
    return null;
  }
}

//Get selected items
var getHTMLOfSelection = function () {
  var range;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    return range.htmlText;
  }
  else if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}
// for navigation
// var MenuRecord = data;
// var items = [];

function CreateContexMenu(MenuRecords) {
  MenuRecord = MenuRecords;
  items.push("<ul class='mainmenu'>");
  for (var i = 0; i < MenuRecords.length; i++) {

    // items.push("<li id='" +dd[i].id + "'>" + dd[i].heading + "</li>");
    items.push("<li>");
    if (MenuRecords[i].sub.length > 0) {

      items.push("<a class='icon-with' id='" + MenuRecords[i].id + "'>" + MenuRecords[i].heading + "</a></i>");
      GernerateSubNavigationMarkup(MenuRecords[i].sub);
    }
    else {
      items.push("<a id='" + MenuRecords[i].id + "'>" + MenuRecords[i].heading + "</a>");
    }
    items.push("</li>");
  }
  var sendJson = '<li><a id="postJson">Post Json</a></li>';
  items.push(sendJson);
  items.push("</ul>");
  $("<div/>", {
    "class": "navigation hide",
    "id": "rmenu",
    html: items.join("")
  }).appendTo("body");
}


// Gernerate SubNavigation Markup
function GernerateSubNavigationMarkup(subMenu) {
  items.push("<ul class='submenu'>");
  for (var i = 0; i < subMenu.length; i++) {
    items.push("<li>");
    if (subMenu[i].sub.length > 0) {

      items.push("<a class='icon-with' id='" + subMenu[i].id + "'>" + subMenu[i].heading + "</a>");
      GernerateSubNavigationMarkup(subMenu[i].sub);
    }
    else {
      items.push("<a id='" + subMenu[i].id + "'>" + subMenu[i].heading + "</a>");
    }
    items.push("</li>");
  }
  items.push("</ul>");
}

var storeContentToIndexJson = function (indexJson, id, content) {
  indexJson.forEach(function (item, index) {

    var parentMenuItemId = id;
    //var selectedContent = content;//e.selectionText;

    if (parentMenuItemId != undefined && parentMenuItemId != "") {
      if (parentMenuItemId.toLowerCase() == item.id.toLowerCase()) {
        contentid = item.id;
        contentval = content;
       // item.content = content;
        return;
      }
    }
    if (item.sub.length > 0) {
      storeContentToIndexJson(item.sub, id, content);
    }
  });
};


document.onselectionchange = function () {
  if (getHTMLOfSelection() != "") {
    selectedContent = getHTMLOfSelection()
  }
};
function GetJson() {
  $.ajax({
    'async': false,
    'global': false,
    'url': 'json/file.json',
    'dataType': "json",
    'success': function (data) {
      CreateContexMenu(data);
    }
  });
}
GetJson();
function requestData(endPoint, onReady) {
  var schema = MenuRecord;
  var postData = JSON.stringify(schema);
  var request = new XMLHttpRequest();
  request.onload = function () {
    onReady(JSON.parse(request.responseText));
  };

  request.onerror = function () {
    onReady([]);
  };

  request.open('POST', endPoint, true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.send(postData);
}
