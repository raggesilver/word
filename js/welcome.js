var $ = require('jquery');
var fs = require('fs');

$(function(){
    setTimeout(function(){
        $(".container").hide();
        $(".welcomeDiv").toggle("show");
        /*$("body").css("background", "#000 url(css/welcome-bg.jpg) no-repeat");*/
    }, 1500);

    $('button').bind("click", function(){
        if($(this).hasClass("gitLink")) return;
       window.location = "file://" + __dirname + "/index.html"
    });

    /*$(".newDoc").hover(function(){
        $(".blur").show();
    });*/

    checkRecoverFiles();
});

function checkRecoverFiles(){
  var fileNames;
  if(fs.existsSync(__dirname + "/recovery/")){
    fileNames = fs.readdirSync(__dirname + "/recovery/");
    if(fileNames.length <= 0){
      document.getElementsByClassName('recoveryFilesDiv')[0].remove();
      return;
    }
  } else {document.getElementsByClassName('recoveryFilesDiv')[0].remove();return;}

  for (var i = 0; i < fileNames.length; i++){
    document.getElementsByClassName('recoveryFilesDiv')[0].innerHTML += "<label>" + fileNames[i].split("/")[fileNames[i].split("/").length - 1] + "</label><button style=\"margin-left: 5px;\"'>Recover</button><br/>";
  }
}

function openExtern(_path){
  alert(_path);
  require("shell").openExternal(_path);
}

function goToGit(){
    require("shell").openExternal("http://www.github.com/raggesilver/WYSIWYG");
}
