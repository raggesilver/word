var $ = require('jquery');

function openFile(){

  $("#openFileDialog").hide();

  var filepath = document.getElementById('filepathinput').value;

  var _title = filepath.split("/");
  var title = _title[_title.length - 1];

  document.title = "Electron WYSIWYG - " + title;

  var fs = require('fs');

  var text = fs.readFileSync(filepath);
  document.getElementById("editor").innerHTML = text;

}
 
