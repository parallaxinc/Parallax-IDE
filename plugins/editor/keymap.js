'use strict';

var motions = {
  moveByScroll: function(cm) {
    //TODO: scroll view by one line
    var scrollbox = cm.getScrollInfo();
  }
}

var keymap = {
  Tab: function(cm) {
      var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
      cm.replaceSelection(spaces);
  },
  F3: "findNext",
  "Shift-F3": "findPrev",
  "Ctrl-Q": motions.moveByScroll
}


module.exports = keymap;

