#!/bin/bash

distro=`uname -a`
arch=`uname -m`

if [[ $distro == *"Linux"* ]]; then distro="linux"; com="xdg-open"; fi
if [[ $distro == *"Darwin"* ]]; then distro="darwin"; com="open"; fi
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
