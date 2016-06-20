  /* Nothing working on here */

var $ = require('jquery');
var fs = require('fs');
fs.readFile('settings.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);
});
alert(obj);
