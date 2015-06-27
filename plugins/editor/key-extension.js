'use strict';

var { findNext, findPrevious } = require('../../src/actions/find');
var { undo } = require('../../src/actions/editor');
var { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
var { dedent, indent } = require('../../src/actions/text-move');
var { print } = require('../../src/actions/system');
var { hideOverlay, newFile, processSave, processSaveAs } = require('../../src/actions/file');

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
      save: {
        code: 'CTRL_S',
        exec: (evt) => {
          evt.preventDefault();
          processSave();
        }
      },
      saveAs: {
        code: 'CTRL_SHIFT_S',
        exec: (evt) => {
          evt.preventDefault();
          processSaveAs();
        }
      },
      hideOverlay: {
        code: 'ESC',
        exec: (evt) => {
          evt.preventDefault();
          hideOverlay();
        }
      }
      //undo: {
        //code: 'CTRL_Z',
        //exec: (evt) => {
          //evt.preventDefault();
          //undo();
        //}
      //}
    };

    const customPredicates = {
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

    function setCodeMirrorCommands() {
      for (let cmd in cmCommands) {
        const code = cmCommands[cmd].code;
        const predicate = customPredicates[code] || app.keypress[code];
        cmCommands[cmd].removeCode = app.keypress(predicate, cmCommands[cmd].exec);
      }
    }

    setCodeMirrorCommands();
  }
};

module.exports = keyExtension;
