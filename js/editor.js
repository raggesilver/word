var $ = require('jquery');

var $editor = $("#editor");

$(function(){
  $(editor).prop('contentEditable', true);

  $("#h1").bind("click", function(){
    document.execCommand("formatBlock", false, "h1");
  });

  $("#h2").bind("click", function(){
    document.execCommand("formatBlock", false, "h2");
  });

  $("#h3").bind("click", function(){
    document.execCommand("formatBlock", false, "h3");
  });

  $("#p").bind("click", function(){
    document.execCommand("formatBlock", false, "p");
  });

  $("#bold").bind("click", function(){
    document.execCommand("bold", false, false);
  });

  $("#italic").bind("click", function(){
    document.execCommand("italic", false, false);
  });

  $("#underline").bind("click", function(){
    document.execCommand("underline", false, false);
  });

  $("#jl").bind("click", function(){
    document.execCommand("justifyLeft", false, false);
  });

  $("#jc").bind("click", function(){
    document.execCommand("justifyCenter", false, false);
  });

  $("#jr").bind("click", function(){
    document.execCommand("justifyRight", false, false);
  });

  $("#jf").bind("click", function(){
    document.execCommand("justifyFull", false, false);
  });

  $("#cblack").bind("click", function() {
    document.execCommand("foreColor", false, "black");
  });

  $("#cred").bind("click", function() {
    document.execCommand("foreColor", false, "red");
  });

  $("#cdarkcyan").bind("click", function() {
    document.execCommand("foreColor", false, "darkcyan");
  });

  $("#cgreen").bind("click", function() {
    document.execCommand("foreColor", false, "green");
  });

  $("#openFileCloseBtn").bind("click", function() {
    $("#openFileDialog").hide();
  });

  $("#undo").bind("click", function(){
    document.execCommand("undo", false, false);
  });

  $("#redo").bind("click", function(){
    document.execCommand("redo", false, false);
  });

  $("#bulletPoints").bind("click", function(){
    document.execCommand("insertUnorderedList", false, false);
  });

  $("#numberPoints").bind("click", function(){
    document.execCommand("insertOrderedList", false, false);
  });

  $(document).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
          event.preventDefault();
          __save();
          break;
        case 'o':
          event.preventDefault();
          __open();
          break;
        case 'd':
          event.preventDefault();
          toggleNoDistractionMode();
          break;
        }
    }
  });

});

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction2() {
    document.getElementById("myDropdown2").classList.toggle("show");
}

function __save(){
  /*var fs = require('fs');
  var text = document.getElementById("editor").innerHTML;
  //alert(text);
  var filename = "test";
  if (!(filename.indexOf(".txt") > -1)) filename = filename + ".txt";
  //alert(filename);

  var path = __dirname + "/" + filename;
  //alert(path);

  var fs = require('fs');
  fs.writeFile(path, text, function(err) {
    if(err) {
        return alert(err);
    }

    console.log("The file was saved!");
  });*/

  $("#saveFileDialog").toggle("show");
  return;

}

function __open(){

  $("#openFileDialog").toggle("show");
  return;

}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if ($("#openFileDialog").is(":visible") && !(event.target.id == "openFileDialog" || $(event.target).parents("#openFileDialog").size())) $("#openFileDialog").toggle("show");
}

function toggleNoDistractionMode(){
  $(".toolBar").toggle("show");
  var isDistractionActive = $('#editor').css('box-shadow') != null;
  alert(isDistractionActive);
  if (isDistractionActive) $('#editor').css('box-shadow', "");
  else $('#editor').css('box-shadow', "0 0 0.5cm rgba(0, 0, 0, 0.3)");
}
