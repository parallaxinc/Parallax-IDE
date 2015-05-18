'use strict';

var keyExtension = {
  setup: function(app, cm) {

    var cmCommands = {
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
      tab: {
        code: 'TAB',
        exec: function() {
          const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        }
      }
    }

    function setCodeMirrorCommands() {
      for (var cmd in cmCommands) {
        var code = cmCommands[cmd].code;
        cmCommands[cmd].removeCode = app.keypress(app.keypress[code], cmCommands[cmd].exec);
      }
    }

    setCodeMirrorCommands();
  }
}

module.exports = keyExtension;
