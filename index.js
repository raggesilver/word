var app = require('app');
var os = require('os');

var BrowserWindow = require('browser-window');

var mainWindow = null;

//if (_os == "linux") { alert(process.env['USER']); }

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		frame: false,
		icon: "logo.png"

	});

	mainWindow.loadUrl('file://' + __dirname + '/welcome.html');
	mainWindow.on('window-all-closed', function () {
		mainWindow = null;
		app.quit();
	});

});
