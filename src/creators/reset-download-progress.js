'use strict';

const {
  RESET_DOWNLOAD_PROGRESS
} = require('../constants/action-types');

function resetDownloadProgress(){
  return {
    type: RESET_DOWNLOAD_PROGRESS,
    payload: {}
  };
}

module.exports = resetDownloadProgress;
