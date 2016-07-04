var $ = require('jquery');
var remote = require('remote');
var dialog = remote.require('dialog');

var fs = require('fs');
var openText;
var openSettings;

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

function openViaPath(filepath, isFromRecover){
  if (!filepath) return false;
  if(!isFromRecover){
    var text = fs.readFileSync(filepath);

    var _title = filepath.split("/");
    //alert(_title.length);
    var title = _title[_title.length - 1];

    document.title = "Electron WYSIWYG - " + title;
    document.getElementById("editor").innerHTML = text;
  } else {
    var text = fs.readFileSync(filepath);

    var _title = filepath.split("/");
    //alert(_title.length);
    var title = _title[_title.length - 1];

    document.title = "Electron WYSIWYG - " + title + " (RECOVERY FILE)";
    document.getElementById("editor").innerHTML = text;
  }

}

function testOpen(){
 dialog.showOpenDialog({ filters: [{ name: 'text', extensions: ['txt'] }]}, function (fileNames) {
   var text = fs.readFileSync(fileNames[0]);
   try {
     var textArr = text.toString();
     textArr = textArr.split("\n");
     var textToRemove = "";
     if(textArr !== 'null' && textArr.length >= 2){
       for (var i = 0; i < textArr.length - 1; i++){
         if (textArr[i].indexOf("@define:")>=0){
           textToRemove += textArr[i].toString();
           var line = textArr[i].split("@define:").pop();
           var definition = line.split(">")[0];
           var value = textArr[i].split(">")[1];
           switch (definition) {
             case 'style':
               setStyle(false, Number(value), null);
               break;
             default:

           }
         }
       }
     }
   } catch (e) {
     throw e;
   }
   setFilepath(fileNames[0]);
   document.getElementById("editor").innerHTML = text.toString().replace(textToRemove.toString(), "");
   openText = text;
   openSettings = textToRemove;
   var _title = fileNames[0].split("/");
   //alert(_title.length);
   var title = _title[_title.length - 1];
   document.title = "Electron WYSIWYG - " + title;

   var f = fs.open("lastfile.txt", "w+");
   f.writeFile("lastfile.txt", fileNames[0],function(err){if(err)return alert(err);});
 });
}

$(function(){
  if(fs.exists("lastfile.txt")) {
    var f = fs.readFileSync("lastfile.txt");
    var text = fs.readFileSync(f);
    document.getElementById("editor").innerHTML = text;

    var _title = f.split("/");
    //alert(_title.length);
    var title = _title[_title.length - 1];
    document.title = "Electron WYSIWYG - " + title;
  }
});

function recoverSession(){
  var dir = __dirname + "/recovery/";
  var files = fs.readdirSync(dir)
              .map(function(v) {
                  return { name:v,
                           time:fs.statSync(dir + v).mtime.getTime()
                         };
               })
               .sort(function(a, b) { return a.time - b.time; })
               .map(function(v) { return v.name; });

  /*for (var i = files.length - 1; i>-1; i--){
    console.log(files[i]);
  }*/
  //setFilepath(__dirname + "/recovery/" + files[files.length - 1]);
  openViaPath(__dirname + "/recovery/" + files[files.length - 1], true);
}

function getOpentext(){return openText;}
function getOpensettings(){return openSettings;}
