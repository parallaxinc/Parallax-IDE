'use strict';

function keyboardShortcuts(app, opts, done){

  const { keypress, handlers } = app;

  const {
    F3,
    TAB,
    ESC,
    CTRL_N,
    CTRL_O,
    CTRL_P,
    CTRL_S,
    CTRL_F4,
    CTRL_UP,
    SHIFT_F3,
    SHIFT_TAB,
    CTRL_DOWN,
    CTRL_SHIFT_S
  } = keypress;

  const {
    newFile,
    saveFile,
    hideOverlay,
    showSaveOverlay,
    showProjectsOverlay,
    findNext,
    findPrevious,
    replace,
    moveByScrollUpLine,
    moveByScrollDownLine,
    indent,
    dedent,
    print
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

  keypress(F3, function(evt){
    evt.preventDefault();
    findNext();
  });

  keypress(SHIFT_F3, function(evt){
    evt.preventDefault();
    findPrevious();
  });

  keypress(CTRL_F4, function(evt){
    evt.preventDefault();
    replace();
  });

  keypress(CTRL_UP, function(evt){
    evt.preventDefault();
    moveByScrollUpLine();
  });

  keypress(CTRL_DOWN, function(evt){
    evt.preventDefault();
    moveByScrollDownLine();
  });

  keypress(TAB, function(evt){
    evt.preventDefault();
    indent();
  });

  keypress(SHIFT_TAB, function(evt){
    evt.preventDefault();
    dedent();
  });

  keypress(CTRL_P, function(evt){
    evt.preventDefault();
    print();
  });

  done();
}

module.exports = keyboardShortcuts;
