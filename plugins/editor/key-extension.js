'use strict';

var CodeMirror = require('codemirror');

const keyExtension = {
  setup: function(app, cm) {

    const cmCommands = {
      findNext: {
        code: 'F3',
        exec: function(evt) {
          evt.preventDefault();
          cm.execCommand('findNext');
        }
      },
      findPrevious: {
        code: 'SHIFT_F3',
        exec: function(evt) {
          evt.preventDefault();
          cm.execCommand('findPrev');
        }
      },
      moveByScrollUpLine: {
        code: 'CTRL_UP',
        exec: function(evt) {
          evt.preventDefault();
          const scrollbox = cm.getScrollInfo();
          cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
        }
      },
      moveByScrollDownLine: {
        code: 'CTRL_DOWN',
        exec: function(evt) {
          evt.preventDefault();
          const scrollbox = cm.getScrollInfo();
          cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
        }
      },
      tab: {
        code: 'TAB',
        exec: function(evt) {
          evt.preventDefault();
          cm.execCommand('insertSoftTab');
          CodeMirror.signal(cm, 'keyHandled', cm);
        }
      },
      print: {
        code: 'CTRL_P',
        exec: function(evt) {
          evt.preventDefault();
          window.print();
        }
      }
    }

    function setCodeMirrorCommands() {
      for (let cmd in cmCommands) {
        const code = cmCommands[cmd].code;
        cmCommands[cmd].removeCode = app.keypress(app.keypress[code], cmCommands[cmd].exec);
      }
    }

    setCodeMirrorCommands();
  }
}

module.exports = keyExtension;
