var $ = require('jquery');

var filepath;
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
