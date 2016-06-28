#!/bin/bash

distro=`uname -a`
arch=`uname -m`

if [[ $distro == *"Linux"* ]]; then
	sudo apt install npm
	distro="linux"
	com="xdg-open"
	if [[ ! `dpkg -s nodejs-legacy` == *"install ok installed"* ]]; then
		sudo apt install nodejs-legacy
	fi
elif [[ $distro == *"Darwin"* ]]; then distro="darwin"; com="open"
else
	exit 1; fi
if [[ $arch == "x86_64" ]]; then arch="x64"; fi

if [[ $distro == "darwin" || $distro == "linux" ]]; then
	if [[ -e "node_modules" ]]; then rm -rf node_modules; fi
	npm install
	sudo npm i electron-packager -g
	electron-packager . Node --platform=$distro --arch=$arch
	if [[ $distro == "darwin" ]]; then
		mv Nod* /Applications/Node\ WYSIWYG
	fi
	exit 0
fi
