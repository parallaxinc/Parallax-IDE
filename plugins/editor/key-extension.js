'use strict';

const _ = require('lodash');

const { findNext, findPrevious, replace } = require('../../src/actions/find');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../../src/actions/editor-move');
const { dedent, indent } = require('../../src/actions/text-move');
const { print } = require('../../src/actions/system');
const { syntaxCheck } = require('../../src/actions/editor');
const { showDownload } = require('../../src/actions/overlay');
const { disableAuto, enableAuto } = require('../../src/actions/device');

const keyExtension = {
  setup: function(app) {

    const cmCommands = {
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
      syntaxCheck: {
        code: ['CTRL_T', 'F7'],
        exec(evt){
          evt.preventDefault();
          syntaxCheck();
        }
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
        const predicate = app.keypress[code];
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
