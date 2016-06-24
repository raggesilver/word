var $ = require('jquery');
var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');

function openFile(){

  $("#openFileDialog").hide();

  var filepath = document.getElementById('filepathinput').value;

  var _title = filepath.split("/");
  //alert(_title.length);
  var title = _title[_title.length - 1];

  document.title = "Electron WYSIWYG - " + title;

  var text = fs.readFileSync(filepath);
  document.getElementById("editor").innerHTML = text;

}

function openViaPath(filepath){
  if (!filepath) return false;
  var text = fs.readFileSync(filepath);

  var _title = filepath.split("/");
  //alert(_title.length);
  var title = _title[_title.length - 1];

  document.title = "Electron WYSIWYG - " + title;
  document.getElementById("editor").innerHTML = text;
}

function testOpen(){
 dialog.showOpenDialog({ filters: [{ name: 'text', extensions: ['txt'] }]}, function (fileNames) {
   var text = fs.readFileSync(fileNames[0]);
   setFilepath(fileNames[0]);
   document.getElementById("editor").innerHTML = text;
   var _title = fileNames[0].split("/");
   //alert(_title.length);
   var title = _title[_title.length - 1];
   document.title = "Electron WYSIWYG - " + title;

   var f = fs.open("./lastfile.txt", "w+");
   f.writeFile("./lastfile.txt", fileNames[0],function(err){if(err)return alert(err);});
 });
}

$(function(){
  if(fs.exists("./lastfile.txt")) {
    var f = fs.readFileSync("./lastfile.txt");
    var text = fs.readFileSync(f);
    document.getElementById("editor").innerHTML = text;

    var _title = f.split("/");
    //alert(_title.length);
    var title = _title[_title.length - 1];
    document.title = "Electron WYSIWYG - " + title;
  }
});
