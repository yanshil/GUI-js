# Investigation

* https://nodejs.org/api/addons.html#addons_hello_world

## Usage of UI?
* If only for box-cylidner structure
	* Parsing data between C++ and JS
	* Integrate simple C++ Addons (Node.js) into front-end (Section [1])
* But if want to combine UI and result rendering, data is too large to do WebGL render
	* Have to 'translate' (rewrite) UI into C++ (Section [2])


## [1]: Try to render via Nova + JS
* https://nodeaddons.com/
* https://nodeaddons.com/getting-your-c-to-the-web-with-node-js/
* https://nodeaddons.com/c-processing-from-node-js/
* https://nodejs.org/api/addons.html

## Socket?
* Maybe No. Streamly parse data may be a disaster for mmap.
https://stackoverflow.com/questions/4873956/why-is-it-not-possible-to-use-mmap-with-socket-fd-as-an-argument


---

## [2]: "Translate" UI into C++
* OpenGL. Keybinding + Hotkeys.....
* Cross Platform toolkit like [Qt](https://www.qt.io/), [GTK](https://www.gtk.org/),[wxWidgets](https://www.wxwidgets.org/)
	* [How do I build a graphical user interface in C++?](https://stackoverflow.com/questions/1186017/how-do-i-build-a-graphical-user-interface-in-c)


### GTK
* Looks like with nice interfaces(like buttons and selectors) to get started
* https://www.gtk.org/features.php

```
No package 'glib-2.0' found
No package 'atk' found
No package 'pango' found
No package 'cairo' found
No package 'cairo-gobject' found
No package 'gdk-pixbuf-2.0' found
```





