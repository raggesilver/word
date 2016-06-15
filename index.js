var app = require('app')

var BrowserWindow = require('browser-window')

app.on('ready', function(){
	var mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		frame: false
	})

	mainWindow.loadUrl('file://' + __dirname + '/index.html')
	mainWindow.on('closed', function () {
		win = null
		app.quit()
	})

})
