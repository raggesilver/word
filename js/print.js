var $ = require('jquery');

function _printFile(){
  $(".toolBar").hide();
  $("#thankNote").hide();
  $("#editor").css("box-shadow", "0 0 0 rgba(0,0,0,0)");
  $("#editor").css("padding", "0");
  document.execCommand("print", false, false);
  $(".toolBar").show();
  $("#thankNote").show();
  $("#editor").css("box-shadow", "0 0 0.5cm rgba(0, 0, 0, 0.3)");
  $("#editor").css("padding", "2cm");
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
