#!/usr/bin/env python3

import gi, json
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GObject

class Window(Gtk.Window):
	"""docstring for Window"""
	def __init__(self):
		super(Window, self).__init__()

		# self.set_default_size(800,350)

		self.hb = Gtk.HeaderBar()
		self.hb.set_show_close_button(True)
		self.hb.set_title('Testing for Word Clone')
		self.set_titlebar(self.hb)

		b = Gtk.Button.new_from_icon_name('window-close-symbolic', Gtk.IconSize.MENU)

		self.hb.pack_start(b)

		self.it = Gtk.IconTheme.get_default()

		self.img = Gtk.Image.new_from_icon_name('window-close-symbolic', Gtk.IconSize.MENU)
		self.add(self.img)

		ctx = self.get_style_context()
		# a = GObject.Value
		# print(ctx.get_style_property('close', a))
		# print(a)

		config = {}

		config['background'] = ctx.get_background_color(Gtk.StateFlags.NORMAL).to_string()
		config['titlebar_background'] = self.hb.get_style_context().get_background_color(Gtk.StateFlags.NORMAL).to_string()

		k = self.it.lookup_icon('window-close-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['close_btn_path'] = k.get_filename()

		g = self.it.lookup_icon('window-minimize-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['minimize_btn_path'] = g.get_filename()

		f = self.it.lookup_icon('window-maximize-symbolic', Gtk.IconSize.MENU, Gtk.StateFlags.NORMAL)
		config['maximize_btn_path'] = f.get_filename()

		with open('custom.json', 'w+') as f:
			print('askdmklasmdlaksmdlaksmdlaksmdlkasm')
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

a = Window()
