'use strict';

const {
  ENABLE_AUTO_DOWNLOAD
} = require('../constants/action-types');

function enableAutoDownload(){
  return {
    type: ENABLE_AUTO_DOWNLOAD,
    payload: {}
  };
}

module.exports = enableAutoDownload;
