'use strict';

const keyExtension = {
  setup: function(app, cm) {

    const cmCommands = {
      findNext: {
        code: 'F3',
        exec: function() {
          cm.execCommand('findNext');
        }
      },
      findPrevious: {
        code: 'SHIFT_F3',
        exec: function() {
          cm.execCommand('findPrev');
        }
      },
      moveByScrollUpLine: {
        code: 'CTRL_UP',
        exec: function() {
          const scrollbox = cm.getScrollInfo();
          cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
        }
      },
      moveByScrollDownLine: {
        code: 'CTRL_DOWN',
        exec: function() {
          const scrollbox = cm.getScrollInfo();
          cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
        }
      },
      print: {
        code: 'CTRL_P',
        exec: function() {
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
