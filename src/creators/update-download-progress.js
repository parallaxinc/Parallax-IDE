'use strict';

const {
  UPDATE_DOWNLOAD_PROGRESS
} = require('../constants/action-types');

function updateDownloadProgress(progress){
  return {
    type: UPDATE_DOWNLOAD_PROGRESS,
    payload: {
      progress
    }
  };
}

module.exports = updateDownloadProgress;
