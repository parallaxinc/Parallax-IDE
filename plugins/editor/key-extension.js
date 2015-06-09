'use strict';

var { findNext, findPrevious } = require('../../src/actions/find');
var { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
var { indent } = require('../../src/actions/text-move');
var { print } = require('../../src/actions/system');

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
      print: {
        code: 'CTRL_P',
        exec: (evt) => {
          evt.preventDefault();
          print();
        }
      }
    };

    function setCodeMirrorCommands() {
      for (let cmd in cmCommands) {
        const code = cmCommands[cmd].code;
        cmCommands[cmd].removeCode = app.keypress(app.keypress[code], cmCommands[cmd].exec);
      }
    }

    setCodeMirrorCommands();
  }
};

module.exports = keyExtension;
