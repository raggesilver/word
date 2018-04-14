const electron = require('electron');
const URL = require('url');
const path = require('path');
const desktopEnv = require('desktop-env');
const { execSync } = require('child_process');
const fs = require('fs-extra');

const postgtk = require('postcss-gtk');
const {readFileSync: read, writeFileSync: write} = require('fs');
const {join} = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

RegExp.quote = function(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function copy_theme(theme, user, mainWindow) {

	var paths = [`/home/${user}/.themes/${theme}`, `/usr/share/themes/${theme}`];

	let mode = fs.F_OK | fs.R_OK;

	var seeking = true;
	var counter = 0;

	while (seeking && counter <= (paths.length - 1)) {

		var a = paths[counter];

		try {

			if(!fs.accessSync(a, mode)) {

				seeking = false;
				console.log(`Found theme on ${a}`);

				// If there is a gtk3-0 folder inside it
				if(fs.accessSync(`${a}/gtk-3.0`, mode)) {
					mainWindow.custom.gtk_theme_path = a;
				} else {
					mainWindow.custom.gtk_theme_path = `${a}/gtk-3.0`;
				}

				if(!fs.accessSync(join(mainWindow.custom.gtk_theme_path, 'assets'), mode)) {

					try {
						if(!fs.accessSync(join(__dirname, 'html', 'output', 'assets'), mode)) {
							fs.removeSync(join(__dirname, 'html', 'output', 'assets'));
						}
					} catch (e) {

					}

					fs.ensureDirSync(__dirname, 'html', 'output', 'assets');
					fs.copySync(join(mainWindow.custom.gtk_theme_path, 'assets'), join(__dirname, 'html', 'output', 'assets'));

				}

			}

		} catch (e) {
			console.log('Could not read theme');
			console.log(e);
		}

		counter++;

	}

}

desktopEnv().then(function(data) {

	console.log(data);

	const { app, BrowserWindow } = electron;

	let mainWindow;
	let settingsWindow;

	if (process.env.DEBUG === 'true') {
		console.log('Debugging mode enabled');
		app.commandLine.appendSwitch('remote-debugging-port', '8315');
		app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');
	}

	// app.disableHardwareAcceleration();

	// Listen for the app to be ready
	app.on('ready', () => {
		// Create main window

		mainWindow = new BrowserWindow({
			height: 500,
			width: 1050,
			frame: false,
			transparent: true
		});

		mainWindow.custom = {
			debug: (process.env.DEBUG === 'true'),
			de: data,
			window_action_layout_to_left: (() => {

				if (data.toLowerCase() == 'gnome') {

					var cmd = execSync('gsettings get org.gnome.desktop.wm.preferences button-layout').toString().replace(/\'/g, '');

					return (cmd[0] != ':');

				} else if (data.toLowerCase() == 'darwin') {
					return true;
				}

				return false;
			})()
		};

		if (data.toLowerCase() == 'gnome' && !process.env.NOGTKCSS) {
			// gsettings get org.gnome.desktop.interface gtk-theme

			var __theme = execSync('gsettings get org.gnome.desktop.interface gtk-theme').toString().replace(/\'/g, '').trim();

			var __user = execSync('whoami').toString().replace(/\'/g, '').trim();

			copy_theme(__theme, __user, mainWindow);

			var cmd = execSync('python3 python/test.py');
			var custom = JSON.parse(fs.readFileSync('custom.json', 'utf8'));

			if(mainWindow.custom.gtk_theme_path) {

				const cwd = mainWindow.custom.gtk_theme_path;
				const fixtures = "{*,**/gtk,**/gtk-dark}.css";

				const iterable = glob.sync(fixtures, {cwd, debug: false});
				console.log(iterable);

				var keep = true;

				for (var i = 0; (i < iterable.length && keep); i++) {

					(function(file_path, i){

						const file_name = file_path.replace(/.*\//, "");
						file_path = join(cwd, file_path);
						const file_dir = file_path.replace(/[\/\\][^\/\\]+$/, "");

						console.log(`\
 _
| |  _
| | | |  _   Test ${i+1}: ${file_name}
| |_| |_| |_______________________________________
\
`);

						const gtk_css = read(file_path, "utf8");

						const output_path = join(__dirname, 'html', 'output');
						const source_map_output_path = `${output_path}.map`;
						const output_dir = output_path.replace(/[\/\\][^\/\\]+$/, "");
						mkdirp.sync(output_dir);

						var find = ['button.titlebutton.close', 'button.titlebutton.minimize', 'button.titlebutton.maximize', 'headerbar,\n\.titlebar:not\\(headerbar\\)'];

						var actual_css = '';

						// Grabbing only what is needed and appending to actual_css
						find.forEach((el) => {
							var  r = new RegExp("[a-zA-Z. #-_:]*(" + el.replace('.', '\.') + ")([^\{]*)?{(\n)?([^\}]*(\n)?)+}", "gm");

							var matches = gtk_css.match(r) || [];
							console.log(matches);
							console.log(JSON.stringify(r.toString()));

							if(matches.length > 0) {
								for(var k = 0; k < matches.length; k++) {
									actual_css += matches[k] + '\n';
									// console.log(matches[k]);
								}
							} else {
								// Fallback using icons
								console.log('No match for ' + el);

								if(fs.accessSync('custom.json', fs.F_OK | fs.R_OK)) {
									return console.error('Fuck this shit');
								} else {

									console.log("WHYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY?");

									actual_css += `
.close {
	-webkit-mask: url(file://${custom.close_btn_path}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
}

.minimize {
	-webkit-mask: url(file://${custom.minimize_btn_path}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
}

.maximize {
	-webkit-mask: url(file://${custom.maximize_btn_path}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
}
									`;


								}


							}

						});

						// change from background-image: -gtk-scaled\(.*\);
						// change to [.]*url\([^\)]*\)

						// Converting the GTK Css to Web Browser Css

						var convertions = [
							{
								_find_reg: new RegExp('(\.){0}headerbar', 'gm'),
								_replace_function: function(a) {
									return '.titlebar'
								}
							},
							{
								_find_reg: new RegExp('background-image: -gtk-scaled\(.*\);', 'gm'),
								_replace_function: function(a) {
									var matches = a.match(new RegExp('[.]*url\([^\)]*\)', 'gm'));
									return 'background-image: ' + matches[0] + ');';
								}
							}
						];

						convertions.forEach(convert => {
							actual_css = actual_css.replace(convert._find_reg, function(a){return convert._replace_function(a)});
						});

						if(process.env.COMPLETEGTK) {
							actual_css += `
.titlebar {
	background-color: ${custom.titlebar_background};
}

.titlebar button {
	color: ${custom.fg_color};
}

.titlebar button:hover {
	background-color: ${custom.titlebutton_hover};
}

.print-button .native-icon {
	-webkit-mask: url(file://${(function(){
		for (var l = 0; l < custom.icons.length; l++) {
			if(custom.icons[l].icon == 'document-print') {
				return custom.icons[l].path;
			}
		}
	})()}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
	display: block;
}
.print-button i {display: none;}

.save-button .native-icon {
	-webkit-mask: url(file://${(function(){
		for (var l = 0; l < custom.icons.length; l++) {
			if(custom.icons[l].icon == 'document-save') {
				return custom.icons[l].path;
			}
		}
	})()}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
	display: block;
}
.save-button i {display: none;}

.toolbar-toggler .native-icon {
	-webkit-mask: url(file://${(function(){
		for (var l = 0; l < custom.icons.length; l++) {
			if(custom.icons[l].icon == 'view-more') {
				return custom.icons[l].path;
			}
		}
	})()}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
	display: block;
}
.toolbar-toggler i {display: none;}

.debug-reload .native-icon {
	-webkit-mask: url(file://${(function(){
		for (var l = 0; l < custom.icons.length; l++) {
			if(custom.icons[l].icon == 'view-refresh') {
				return custom.icons[l].path;
			}
		}
	})()}) no-repeat 50% 50%;
	background-color: ${custom.fg_color} !important;
	display: block;
}
.debug-reload i {display: none;}

.titlebar button {
	height: auto !important;
    margin: 7px 5px;
    padding-left: 5px !important;
    padding-right: 5px !important;
    border-radius: 2px;
}

.native {
	display: initial;
}

.divider {
	border-color: ${custom.fg_color};
}
							`;

							// console.log(custom.icons);

						}

						// Writing to the output file
						write(join(output_path, file_name), actual_css, "utf8");

					})(iterable[i], i);

				}

			}

		}

		// Load html
		mainWindow.loadURL(`file://${__dirname}/html/main.html`);
	});

});
