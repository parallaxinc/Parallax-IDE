'use strict';

var { findNext, findPrevious } = require('../../src/actions/find');
var { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
var { dedent, indent } = require('../../src/actions/text-move');
var { print } = require('../../src/actions/system');
var { hideOverlay, newFile, processSave } = require('../../src/actions/file');

const keyExtension = {
  setup: function(app) {

    const cmCommands = {
      findNext: {
        code: 'F3',
        exec: (evt) => {
          evt.preventDefault();
          findNext();
        }
      },
      findPrevious: {
        code: 'SHIFT_F3',
        exec: (evt) => {
          evt.preventDefault();
          findPrevious();
        }
      },
      moveByScrollUpLine: {
        code: 'CTRL_UP',
        exec: (evt) => {
          evt.preventDefault();
          moveByScrollUpLine();
        }
      },
      moveByScrollDownLine: {
        code: 'CTRL_DOWN',
        exec: (evt) => {
          evt.preventDefault();
          moveByScrollDownLine();
        }
      },
      tab: {
        code: 'TAB',
        exec: (evt) => {
          evt.preventDefault();
          indent();
        }
      },
      shiftTab: {
        code: 'SHIFT_TAB',
        exec: (evt) => {
          evt.preventDefault();
          dedent();
        }
      },
      print: {
        code: 'CTRL_P',
        exec: (evt) => {
          evt.preventDefault();
          print();
        }
      },
      newFile: {
        code: 'CTRL_N',
        exec: (evt) => {
          evt.preventDefault();
          newFile();
        }
      },
      save: {
        code: 'CTRL_S',
        exec: (evt) => {
          evt.preventDefault();
          processSave();
        }
      },
      hideOverlay: {
        code: 'ESC',
        exec: (evt) => {
          evt.preventDefault();
          hideOverlay();
        }
      }
    };

    const customPredicates = {
      CTRL_N: function({ ctrlKey, metaKey, keyCode }){
          return ((ctrlKey === true || metaKey === true) && keyCode === 78);
        }
    };

    function setCodeMirrorCommands() {
      for (let cmd in cmCommands) {
        const code = cmCommands[cmd].code;
        const predicate = app.keypress[code] || customPredicates[code];
        cmCommands[cmd].removeCode = app.keypress(predicate, cmCommands[cmd].exec);
      }
    }

    setCodeMirrorCommands();
  }
};

module.exports = keyExtension;
