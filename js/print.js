var $ = require('jquery');

function _printFile(){

  var wasOnFocus = isItOnFocusMode();
  if (!wasOnFocus) toggleNoDistractionMode();
  $("#thankNote").hide();
  $("#editor").css("padding", "0");
  document.execCommand("print", false, false);
  $("#thankNote").show();
  if (!wasOnFocus) toggleNoDistractionMode();
  $("#editor").css("padding", "2cm");
  
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
