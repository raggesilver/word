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
