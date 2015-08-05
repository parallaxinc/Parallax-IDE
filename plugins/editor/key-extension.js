'use strict';

const _ = require('lodash');

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
      identify: {
        code: ['F6', 'CTRL_I'],
        exec: (evt) => {
          evt.preventDefault();
          disableAuto();
          showDownload();
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
