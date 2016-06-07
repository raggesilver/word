var app = require('app')

var BrowserWindow = require('browser-window')

app.on('ready', function(){
	var mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: true
	})

	mainWindow.loadUrl('file://' + __dirname + '/index.html')
	mainWindow.on('closed', function () {
		win = null
		app.quit()
	})

})
