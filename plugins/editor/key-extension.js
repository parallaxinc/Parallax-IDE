'use strict';

const _ = require('lodash');

const { findNext, findPrevious, replace } = require('../../src/actions/find');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
const { dedent, indent } = require('../../src/actions/text-move');
const { print } = require('../../src/actions/system');
const { syntaxCheck } = require('../../src/actions/editor');
const { nextFile, newFile, previousFile, saveFile, saveFileAs } = require('../../src/actions/file');
const { hideOverlays, showSave, showDownload, showProjects } = require('../../src/actions/overlay');
const { disableAuto, enableAuto } = require('../../src/actions/device');

class KeyExtension {

  constructor(app) {
    this.app = app;
    this.cmCommands = {
      download: {
        code: ['F9', 'CTRL_R'],
        exec: (evt) => {
          evt.preventDefault();
          enableAuto();
          showDownload();
        }
      },
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
      identify: {
        code: ['F6', 'CTRL_I'],
        exec: (evt) => {
          evt.preventDefault();
          disableAuto();
          showDownload();
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
      replace: {
        code: 'CTRL_F4',
        exec: (evt) => {
          evt.preventDefault();
          replace();
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
      nextFile: {
        code: 'CTRL_TAB',
        exec: (evt) => {
          evt.preventDefault();
          nextFile();
        }
      },
      previousFile: {
        code: 'CTRL_SHIFT_TAB',
        exec: (evt) => {
          evt.preventDefault();
          previousFile();
        }
      },
      save: {
        code: 'CTRL_S',
        exec: (evt) => {
          evt.preventDefault();
          saveFile();
        }
      },
      saveAs: {
        code: 'CTRL_SHIFT_S',
        exec: (evt) => {
          evt.preventDefault();
          showSave();
        }
      },
      hideOverlay: {
        code: 'ESC',
        exec: (evt) => {
          evt.preventDefault();
          hideOverlays();
        }
      },
      projects: {
        code: 'CTRL_O',
        exec(evt){
          evt.preventDefault();
          showProjects();
        }
      },
      syntaxCheck: {
        code: ['CTRL_T', 'F7'],
        exec(evt){
          evt.preventDefault();
          syntaxCheck();
        }
      }
    };

    this.overlayCommands = {
      enter: {
        code: 'ENTER',
        exec(evt){
          evt.preventDefault();
          saveFileAs();
        }
      },
      hideOverlay: {
        code: 'ESC',
        exec: (evt) => {
          evt.preventDefault();
          hideOverlays();
        }
      }
    };

    this.customPredicates = {
      CTRL_N: function({ ctrlKey, metaKey, keyCode }){
        return ((ctrlKey === true || metaKey === true) && keyCode === 78);
      },
      CTRL_SHIFT_S: function({ ctrlKey, metaKey, keyCode, shiftKey }){
        return ((ctrlKey === true || metaKey === true) && shiftKey === true && keyCode === 83);
      },
      CTRL_S: function({ ctrlKey, metaKey, keyCode, shiftKey }){
        return ((ctrlKey === true || metaKey === true) && shiftKey === false && keyCode === 83);
      }
    };
  }

  setBaseCommands() {
    for (let cmd in this.cmCommands) {
      const codes = this.cmCommands[cmd].code;
      const codesArray = (Array.isArray(codes)) ? codes : [codes];
      this.setCommand(this.cmCommands, cmd, codesArray);
    }
  }

  removeBaseCommands() {
    for (let cmd in this.cmCommands) {
      if(this.cmCommands[cmd].remove) {
        this.cmCommands[cmd].remove();
      }
    }
  }

  setOverlayCommands() {
    for (let cmd in this.overlayCommands) {
      const codes = this.overlayCommands[cmd].code;
      const codesArray = (Array.isArray(codes)) ? codes : [codes];
      this.setCommand(this.overlayCommands, cmd, codesArray);
    }
  }

  removeOverlayCommands() {
    for (let cmd in this.overlayCommands) {
      if(this.overlayCommands[cmd].remove) {
        this.overlayCommands[cmd].remove();
      }
    }
  }

  setCommand(set, cmd, codes) {
    codes.forEach((code) => {
      const predicate = this.customPredicates[code] || this.app.keypress[code];
      const oldRemove = set[cmd].remove;
      const newRemove = this.app.keypress(predicate, set[cmd].exec);
      if(oldRemove){
        set[cmd].remove = _.flow(oldRemove, newRemove);
      } else {
        set[cmd].remove = newRemove;
      }
    });
  }
}

module.exports = KeyExtension;
