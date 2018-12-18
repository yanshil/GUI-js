## Emscripten

Compiler from LLVM to js

* https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html
* https://blog.scottlogic.com/2014/03/12/native-code-emscripten-webgl-simmer-gently.html


```
emcc TestEmscripten.cpp -o te.js -s FULL_ES2=1 -s EXPORTED_FUNCTIONS=['_setXposition'] -s WASM=0 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
```

### Dependency
```
./TestEmscripten.cpp
./te.js 	// Generated file
```

## Add-on

```
./binding.gyp
./addon.js
./addon.cpp
./package.json
```


