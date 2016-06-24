var $ = require('jquery');
require('jquery-ui');

var $editor = $("#editor");

var isOnFocusMode = false; // create a method to read this from a "settings.json" file

var jsPDF = require('jspdf');

$(function(){
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  if (isMac) {
      $(".closeBtn").css({
        "position": "fixed",
        "left": "3px"
      });
      $("#menuButton, .menuBtn").css({
        "position": "fixed",
        "right": "3px"
      });
    } else {
      $(".closeBtn").css({
        "position": "fixed",
        "right": "3px"
      });
      $("#menuButton, .menuBtn").css({
        "position": "fixed",
        "left": "3px"
      });
    }
});

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

  $("#bold, #bold2").bind("click", function(){
    document.execCommand("bold", false, false);
  });

  $("#italic, #italic2").bind("click", function(){
    document.execCommand("italic", false, false);
  });

  $("#underline, #underline2").bind("click", function(){
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

  $("#saveFileCloseBtn").bind("click", function() {
    $("#saveFileDialog").hide();
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
    $("#floatFormatBox").hide();
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
          event.preventDefault();
          //__save();
          testSave(); // new system save file dialog
          break;
        case 'o':
          event.preventDefault();
          //__open();
          testOpen(); // new system file chooser dialog
          break;
        case 'd':
          event.preventDefault();
          toggleNoDistractionMode();
          break;
        case 'p':
          event.preventDefault();
          _printFile();
          break;
        case '1':
          event.preventDefault();
          document.execCommand("formatBlock", false, "h1");
          break;
        case '2':
          event.preventDefault();
          document.execCommand("formatBlock", false, "h2");
          break;
        case '3':
          event.preventDefault();
          document.execCommand("formatBlock", false, "h3");
          break;
        case '0':
          event.preventDefault();
          document.execCommand("formatBlock", false, "p");
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

  if (needFilename() == true) {

    $("#saveFileDialog").toggle("show");

  } else {
    saveFile();
  }

}

function __open(){

  $("#openFileDialog").toggle("show");
  return;

}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(e) {
  var container = $(".dropdown-content")[0];

  if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0)  {

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
  if ($("#saveFileDialog").is(":visible") && !(event.target.id == "saveFileDialog" || $(event.target).parents("#saveFileDialog").size())) $("#saveFileDialog").toggle("show");
}

function toggleNoDistractionMode(){
  if (isOnFocusMode){
    $(".toolBar").show();
    $('.editor').css('box-shadow', "0 0 0.5cm rgba(0, 0, 0, 0.3)");
  } else {
    $(".toolBar").hide();
    $('.editor').css("box-shadow", "0 0 0 rgba(0,0,0,0)");
  }

  isOnFocusMode = !isOnFocusMode;
}

document.ondrop = function (e) {
  e.preventDefault();

  for (var i = 0; i < e.dataTransfer.files.length; ++i) {
    // console.log(e.dataTransfer.files[i].path);
    var dragFilepath = e.dataTransfer.files[i].path;
    if (dragFilepath.indexOf(".txt") > -1){
      openViaPath(dragFilepath);
    } else {
      alert("File type unsupported. If it is a picture, please use ctrl+c and ctrl+v or wait for a new decent version.");
    }
  }
  return false;
};

function isItOnFocusMode() {return isOnFocusMode;}

function useToolbarBackgorund(path, use){
  if (use) $(".headerBar").css("background-image", "url('" + path +"')");
  else $(".headerBar").css("background-image", "");
}

var floatOpen = false;
var lastText = null;
var text = null;

// Float box opening function

$(window).bind("mouseup", function(e){

  if (floatOpen){ // if clicked outside

    var container = $("#floatFormatBox");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) {$("#floatFormatBox").hide();}
    floatOpen = false;
  }

  if ($("#filepathinput").is(":focus") || $("#saveFileInput").is(":focus")) return; // if typing file path
  if ($(".toolBar").is(":focus") || $(".toolBtn").is(":focus") || $(".dropdown").is(":focus") || $(".btn").is(":focus") || $(".myDropdown2").is(":focus") || $(".btn2").is(":focus")) return;
  // something is wrong in the if above

  if (window.getSelection) text = window.getSelection().toString();
  else if (document.selection && document.selection.type != "Control") text = document.selection.createRange().text;
  else return;

  if (text == "" || text == null) return;
  if (lastText == text) {
    floatOpen = false;
    $("#floatFormatBox").hide();
    lastText = ""; // word unselected, so text is empty now
    return;
  }

  lastText = text;

  $("#floatFormatBox").css( {position:"absolute", top:e.pageY, left: e.pageX});

  $("#floatFormatBox").show();
  floatOpen = true;
});

function clearSelection() {
  if ( document.selection ) {
    document.selection.empty();
  } else if ( window.getSelection ) {
    window.getSelection().removeAllRanges();
  }
}

// Ask for saving before closing
// PLEASE IMPROVE THIS IMEDIATELY

var quitTimes = 0;

window.onbeforeunload = confirmExit;
function confirmExit() {
    if (needFilename() == true && quitTimes <= 0) {
      return("You haven't saved your work. Sure you wanna quit? Quit again for yes");
      quitTimes++;
    }
};

// PDF generator (not working)

function generatePDF(){
  var doc = new jsPDF();
  var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
  };

  doc.fromHTML($('#editor').html(), 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });
  doc.save('sample-file.pdf');
}

// menu button on click

$(function(){
  $("#advTools").hide();
  $("#advFormatTools").hide();

  $("#menuButton").bind("click", function(){
    if($("#advTools").is(":visible")) $("#advTools").hide(150);
    else $("#advTools").show(150);
  });

});

// Toggle advanced formatting tools (font family, size...)

function toggleAdvFormat(){
  if($("#advFormatTools").is(":visible"))
  {
    $("#advFormatTools").hide(100);
    $("#advFormatToolsBtnImg").css("-webkit-transform", "rotate(360deg)");

  } else {
    $("#advFormatTools").show(100);
    $("#advFormatToolsBtnImg").css("-webkit-transform", "rotate(180deg)");
  }
}

 // Font selector

$(function(){
  $("#fontFamilySelection").change(function(){
    document.execCommand("fontName", false, $("#fontFamilySelection").val());
  });

  $("#fontSizeBox").change(function(){
    document.execCommand("foreSize", false, $("#fontSizeBox").val());
  });

  $(editor).on("mouseup", function(){
    var font = document.queryCommandValue("FontName");
    font = font.replace("'", "").replace("'", "");
    $("#fontFamilySelection").val(font);
    var size = document.queryCommandValue("FontSize");
    $("#fontSizeBox").val(size);
  })
});


$('.editor').wysiwygResize({selector: "div, td, h1, h3"});
