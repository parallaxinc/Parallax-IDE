'use strict';

const _ = require('lodash');

const { findNext, findPrevious, replace } = require('../../src/actions/find');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
const { dedent, indent } = require('../../src/actions/text-move');
const { print } = require('../../src/actions/system');
const { newFile, saveFile } = require('../../src/actions/file');
const { hideOverlays, showSave, showDownload, showProjects } = require('../../src/actions/overlay');
const { disableAuto } = require('../../src/actions/device');

const keyExtension = {
  setup: function(app) {

    const cmCommands = {
      download: {
        code: ['F9', 'CTRL_R'],
        exec: (evt) => {
          evt.preventDefault();
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
      }
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
        const codes = cmCommands[cmd].code;
        const codesArray = (Array.isArray(codes)) ? codes : [codes];
        setCommand(cmd, codesArray);
      }
    }

    function setCommand(cmd, codes) {
      codes.forEach((code) => {
        const predicate = customPredicates[code] || app.keypress[code];
        const oldRemove = cmCommands[cmd].remove;
        const newRemove = app.keypress(predicate, cmCommands[cmd].exec);
        if(oldRemove){
          cmCommands[cmd].remove = _.flow(oldRemove, newRemove);
        } else {
          cmCommands[cmd].remove = newRemove;
        }
      });
    }

    setCodeMirrorCommands();
  }
};

module.exports = keyExtension;
