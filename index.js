var app = require('app');
var os = require('os');

var BrowserWindow = require('browser-window');

var mainWindow = null;

var _os = os.platform();
var username = "";
var path = "";
var fullpath = "";

//if (_os == "linux") { alert(process.env['USER']); }

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		frame: false
	});

	mainWindow.loadUrl('file://' + __dirname + '/index.html');
	mainWindow.on('closed', function () {
		mainWindow = null;
		app.quit();
	});

});
