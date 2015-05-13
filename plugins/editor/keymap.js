'use strict';

const events = {
  projectEvent: new Event('showProject'),
  saveEvent: new Event('saveFile'),
  listFiles: new Event('listFiles')
};

const motions = {
  moveByScrollUpLine: function(cm) {
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  },
  moveByScrollDownLine: function(cm) {
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }
};

const keymap = {
  Tab: function(cm) {
      const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
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
  },
  "Ctrl-P": function(cm) {
    //TODO: still need to hide sidebar/topbar on print
    window.print();
  },
  "Ctrl-Tab": function(cm) {
    //TODO: next file
    window.dispatchEvent(events.listFiles);
  },
  "Ctrl-Shift-Tab": function(cm) {
    //TODO: previous file
    window.dispatchEvent(events.listFiles);
  }
}

module.exports = keymap;
