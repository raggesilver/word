var $ = require('jquery');
var remote = require('remote');
var dialog = remote.require('dialog');
var noty = require('noty');

var filepath = null;
var fs = require('fs');

function needFilename(){
  return filepath == "" || filepath == null;
}

function saveFile(){
   if (filepath != "") {

     filepath = document.getElementById('saveFileInput').value;

     if (filepath == "") {
       alert("Please insert a file name");
       return;
     }

     $("#saveFileDialog").hide();
   }

   var text = document.getElementById('editor').innerHTML;

   fs.writeFile(filepath, text, function(err) {
     if(err) {
       return alert(err);
     }
   });

   document.title = "Electron WYSIWYG - " + filepath;
}

function setFilepath(path){
  filepath = path;
}

function testSave(){
  if (filepath != "" && filepath != null){
    var text = document.getElementById('editor').innerHTML;
    fs.writeFile(filepath, text,function(err){if(err)return alert(err);});
    var n = noty({
      text: "saved",
      layout: "bottomRight",
      timeout: 500,
    });
    return;
  }
  dialog.showSaveDialog({ filters: [{ name: 'text', extensions: ['txt'] }]}, function (fileName) {
    if(fileName.indexOf(".txt") <= 0) fileName = fileName + ".txt";
     var text = document.getElementById('editor').innerHTML;
     fs.writeFile(fileName, text, function(err){
       if(err) {console.log("error: " + err); return;}
       document.title = "Electron WYSIWYG - " + fileName;
     });
     filepath = fileName;
   });
}

function saveSession(){
  if(!fs.existsSync(__dirname + "/recovery")) fs.mkdirSync(__dirname + "/recovery");
  var tmpTitle = "Untitled-" + Date();
  if (needFilename()) {
    var titles = document.getElementsByTagName("h1");
    if(titles.length >= 2) tmpTitle = titles[1].innerHTML;
    setFilepath(__dirname + "/recovery/" + tmpTitle + ".txt");
    testSave();
  } else {
    var filepathArr = filepath.split("/");
    var tmpFilename = filepathArr[filepathArr.length - 1];
    setFilepath(__dirname + "/recovery/" + tmpFilename);
    testSave();
  }


}
