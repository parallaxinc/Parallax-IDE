'use strict';

const keyExtension = {
  setup: function(app, cm) {

    const toRegister = {
      findNext: function() {
        cm.execCommand('findNext');
      },
      findPrevious: function() {
        cm.execCommand('findPrev');
      },
      moveByScrollUpLine: function() {
        const scrollbox = cm.getScrollInfo();
        cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
      },
      moveByScrollDownLine: function() {
        const scrollbox = cm.getScrollInfo();
        cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
      },
      Tab: function() {
        const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    }

    // TODO: Write function to regester all in toRegister obj
    app.keypress.register('F3', toRegister.findNext);
    app.keypress.register('SHIFT-F3', toRegister.findPrevious);
    app.keypress.register('CTRL_UP', toRegister.moveByScrollUpLine);
    app.keypress.register('CTRL_DOWN', toRegister.moveByScrollDownLine);

  }
}

module.exports = keyExtension;
