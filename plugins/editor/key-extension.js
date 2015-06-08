'use strict';

var { findNext, findPrevious, moveByScrollUpLine,
      moveByScrollDownLine, tab, print } = require('../../src/actions/keys');

const keyExtension = {
  setup: function(app) {

    const cmCommands = {
      findNext: {
        code: 'F3',
        exec: findNext
      },
      findPrevious: {
        code: 'SHIFT_F3',
        exec: findPrevious
      },
      moveByScrollUpLine: {
        code: 'CTRL_UP',
        exec: moveByScrollUpLine
      },
      moveByScrollDownLine: {
        code: 'CTRL_DOWN',
        exec: moveByScrollDownLine
      },
      tab: {
        code: 'TAB',
        exec: tab
      },
      print: {
        code: 'CTRL_P',
        exec: print
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
