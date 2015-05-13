'use strict';

var events = {
  projectEvent: new Event('showProject'),
  saveEvent: new Event('saveFile')
};

var motions = {
  moveByScrollUpLine: function(cm) {
    var scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  },
  moveByScrollDownLine: function(cm) {
    var scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }
};

var keymap = {
  Tab: function(cm) {
      var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
      cm.replaceSelection(spaces);
  },
  F3: "findNext",
  "Shift-F3": "findPrev",
  "Ctrl-Up": motions.moveByScrollUpLine,
  "Ctrl-Down": motions.moveByScrollDownLine,
  "Cmd-Up": motions.moveByScrollUpLine,
  "Cmd-Down": motions.moveByScrollDownLine,
  "Ctrl-O": function(cm) {
    window.dispatchEvent(events.projectEvent);
  },
  "Ctrl-S": function(cm) {
    window.dispatchEvent(events.saveEvent);
  }
}

module.exports = keymap;
