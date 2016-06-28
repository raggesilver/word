var $ = require('jquery');
var fs = require('fs');

var filename = "light.css";

//if(fs.existsSync(__dirname + '/css/custom.css')) filename = "custom.css";

var ls = document.createElement('link');
ls.rel="stylesheet";
ls.href= "css/" + filename;
document.getElementsByTagName('head')[0].appendChild(ls);

$(function(){
  getSettings();
});

function getSettings(){
  /*if(fs.existsSync(__dirname + '/js/settings.txt')){
    var _settings = fs.readFileSync(__dirname + '/js/settings.txt');
    var isDark = false;

    if(_settings.indexOf(",")) {
      var settingsArr = _settings.split(",");
      if (settingsArr[0] == "false" || settingsArr[0] == "true") isDark = Boolean(settingsArr[0]);
    } else {
      if(_settings == "true") isDark = true;
    }
    setMode(isDark);
  } else {
    var defaultSettings = "false";
    fs.writeFile(__dirname + '/js/settings.txt', defaultSettings, function(err){if(err){console.log("Error on settings default settings!");}});
    setMode(false);
  }*/
  setMode(false)
  return;
}

function setSettings(){
  /*var text = isDarkMode().toString();
  fs.writeFile(__dirname + '/js/settings.txt', text, function(err){console.log("Error on saving settings!");});*/
  return;
}
