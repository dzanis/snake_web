call emcc main.c -o web/main.js -s WASM=1  -s NO_EXIT_RUNTIME=1   -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -s "EXPORTED_FUNCTIONS=['_initGL','_resizeGL','_drawGL','_keyDown','_keyUp','_hide','_show']"
@pause

