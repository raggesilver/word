const electron = require('electron');
const URL = require('url');
const path = require('path');
const desktopEnv = require('desktop-env');

desktopEnv().then(data => {
	const {
		app,
		BrowserWindow
	} = electron;
	
	let mainWindow;
	let settingsWindow;
	
	if(process.env.DEBUG === 'true') {
		console.log('Debugging mode enabled');
		app.commandLine.appendSwitch('remote-debugging-port', '8315');
		app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');
	}
	
	// Listen for the app to be ready
	app.on('ready', () => {
		// Create main window
		mainWindow = new BrowserWindow({
			height: 500,
			width: 1050,
			frame: false
		});

		mainWindow.custom = {
			debug: (process.env.DEBUG === 'true'),
			de: data,
			window_action_layout_to_left: (()=>{

				if(data.toLowerCase() == 'gnome') {

					const { execSync } = require('child_process');
					var cmd = execSync('gsettings get org.gnome.desktop.wm.preferences button-layout');

					return (cmd[0] != ':');

				} else if (data.toLowerCase() == 'darwin') {
					return true;
				}

				return false;
			})()
		}
	
		// Load html
		mainWindow.loadURL(`file://${__dirname}/html/main.html`);
	});
});
