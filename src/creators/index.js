'use strict';

const creators = {
  // overlay creators
  deleteProjectConfirm: require('./delete-project-confirm'),
  showDeleteFileOverlay: require('./show-delete-file-overlay'),
  showDeleteProjectOverlay: require('./show-delete-project-overlay'),
  showDownloadOverlay: require('./show-download-overlay'),
  showProjectsOverlay: require('./show-projects-overlay'),
  showSaveOverlay: require('./show-save-overlay'),
  hideOverlay: require('./hide-overlay'),
  // terminal creators
  rxOn: require('./rx-on'),
  rxOff: require('./rx-off'),
  txOn: require('./tx-on'),
  txOff: require('./tx-off'),
  transmit: require('./transmit'),
  updateDuration: require('./update-duration'),
  // device creators
  connect: require('./connect'),
  disconnect: require('./disconnect'),
  reloadDevices: require('./reload-devices'),
  updateDevices: require('./update-devices'),
  enableAutoDownload: require('./enable-auto-download'),
  disableAutoDownload: require('./disable-auto-download'),
  updateSearchStatus: require('./update-search-status'),
  clearSearchStatus: require('./clear-search-status'),
  updateSelectedDevice: require('./update-selected-device'),
  resetDownloadProgress: require('./reset-download-progress'),
  updateDownloadProgress: require('./update-download-progress')
};

module.exports = creators;
