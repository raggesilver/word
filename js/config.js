var $ = require('jquery');

var filename = "style.css";

if(fs.existsSync(__dirname + '/css/custom.css')) filename = "custom.css";

var ls = document.createElement('link');
ls.rel="stylesheet";
ls.href= "css/" + filename;
document.getElementsByTagName('head')[0].appendChild(ls);

if(fs.existsSync(__dirname + '/css/bg.png')) $('body').css("background-image", "url(" +__dirname + '/css/bg.png' +")");
if(fs.existsSync(__dirname + '/css/bg.jpg')) $('.editor').css("background-image", "url(" +__dirname + '/css/bg.jpg' +")");
