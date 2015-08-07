'use strict';

const {
  DISABLE_AUTO_DOWNLOAD
} = require('../constants/action-types');

function disableAutoDownload(){
  return {
    type: DISABLE_AUTO_DOWNLOAD,
    payload: {}
  };
}

module.exports = disableAutoDownload;
