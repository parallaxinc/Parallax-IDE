'use strict';

function keyboardShortcuts(app, opts, done){

  const { keypress, handlers } = app;

  const {
    ESC,
    CTRL_O,
    CTRL_N,
    CTRL_S,
    CTRL_SHIFT_S
  } = keypress;

  const {
    newFile,
    saveFile,
    hideOverlay,
    showSaveOverlay,
    showProjectsOverlay
  } = handlers;

  keypress(CTRL_N, function(evt){
    evt.preventDefault();
    newFile();
  });

  keypress(CTRL_S, function(evt){
    evt.preventDefault();
    saveFile();
  });

  keypress(CTRL_SHIFT_S, function(evt){
    evt.preventDefault();
    showSaveOverlay();
  });

  keypress(CTRL_O, function(evt){
    evt.preventDefault();
    showProjectsOverlay();
  });

  keypress(ESC, function(evt){
    evt.preventDefault();
    // TODO: this won't clear text in a textbox, need to move to store?
    hideOverlay();
  });

  done();
}

module.exports = keyboardShortcuts;
