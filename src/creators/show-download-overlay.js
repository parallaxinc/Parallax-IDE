'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  DOWNLOAD_OVERLAY
} = require('../constants/overlay-states');

function showDownloadOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: DOWNLOAD_OVERLAY
    }
  };
}

module.exports = showDownloadOverlay;
