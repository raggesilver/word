var $ = require('jquery');

var db = new Dropbox.Client({ key: 'dpmpa8axqdcbfrk', secret: 'pm58hkg58vrp8om' });
db.receiverUrl = "file://" + __dirname + "/index.html";

$(function(){
  db.authenticate(function (error, client) {
                  if (error) {
                      alert('Error: ' + error);
                  } else {
                      saveToDropbox();
                  }
              });
});


function saveToDropbox(){
  db.writeFile('hello.txt', 'Hello, World!', function (error) {
                if (error) {
                    alert('Error: ' + error);
                } else {
                    alert('File written successfully!');
                }
            });
}
