'use strict';

const {
  RESET_DOWNLOAD_PROGRESS,
  UPDATE_DOWNLOAD_PROGRESS
} = require('../constants/action-types');

const initial = 0;

function downloadProgress(state = initial, { type, payload }){
  switch(type){
    case RESET_DOWNLOAD_PROGRESS:
      return initial;
    case UPDATE_DOWNLOAD_PROGRESS:
      return payload.progress;
    default:
      return state;
  }
}

module.exports = downloadProgress;
