#!/usr/bin/env python3

import gi, json
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GObject

class Window(Gtk.Window):
	"""docstring for Window"""
	def __init__(self):
		super(Window, self).__init__()

		self.hb = Gtk.HeaderBar()
		self.hb.set_show_close_button(True)
		self.hb.set_title('Testing for Word Clone')
		self.set_titlebar(self.hb)

		self.required_icons = [
			'document-print',
			'document-save',
			'view-more',
			'view-refresh'
		];

		print(self.required_icons)

		b = Gtk.Button.new_from_icon_name('window-close-symbolic', Gtk.IconSize.MENU)

		self.hb.pack_start(b)

		self.it = Gtk.IconTheme.get_default()

		self.img = Gtk.Image.new_from_icon_name('window-close-symbolic', Gtk.IconSize.MENU)
		self.add(self.img)

		ctx = self.get_style_context()

		config = {}

		config['fg_color'] = self.hb.get_style_context().get_color(Gtk.StateFlags.NORMAL).to_string()

		config['titlebutton_hover'] = b.get_style_context().get_background_color(Gtk.StateFlags.PRELIGHT).to_string()

		config['background'] = ctx.get_background_color(Gtk.StateFlags.NORMAL).to_string()

		config['titlebar_background'] = self.hb.get_style_context().get_background_color(Gtk.StateFlags.NORMAL).to_string()

		k = self.it.lookup_icon('window-close-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['close_btn_path'] = k.get_filename()

		g = self.it.lookup_icon('window-minimize-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['minimize_btn_path'] = g.get_filename()

		f = self.it.lookup_icon('window-maximize-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['maximize_btn_path'] = f.get_filename()

		h = self.get_icons()
		print(h)
		if h:
			config['icons'] = h
		else:
			print('NOT ICONS')

		with open('custom.json', 'w+') as f:
			print(config)
			json.dump(config, f)
			f.close()

		# self.connect('delete-event', Gtk.main_quit)
		# self.show_all()
        #
		# print(self.hb.get_children())
		# print(len(self.hb.get_children()))
        #
		# Gtk.main()

	def get_icons(self, *args):

		print('Called')

		icons = []

		for x in range(len(self.required_icons)):
			ic = self.it.lookup_icon(self.required_icons[x] + '-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)

			if ic:
				icons.append({'icon': self.required_icons[x], 'path': ic.get_filename()})
			else:
				print('Could not load required icon ' + self.required_icons[x])
				return False

		return icons

print('Called')
a = Window()
