var fs = require('fs');

var filename = "style.css";

if (fs.stat("./css/custom.css")) filename = "custom.css";

var ls = document.createElement('link');
ls.rel="stylesheet";
ls.href= "css/" + filename;
document.getElementsByTagName('head')[0].appendChild(ls);
