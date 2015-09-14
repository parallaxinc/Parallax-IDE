'use strict';

const creators = {
  // overlay creators
  deleteProjectConfirm: require('./delete-project-confirm'),
  showDeleteFileOverlay: require('./show-delete-file-overlay'),
  showDeleteProjectOverlay: require('./show-delete-project-overlay'),
  showDownloadOverlay: require('./show-download-overlay'),
  showProjectsOverlay: require('./show-projects-overlay'),
  showOverwriteOverlay: require('./show-overwrite-overlay'),
  showNewVersionOverlay: require('./show-new-version-overlay'),
  showSaveOverlay: require('./show-save-overlay'),
  showSaveOnChangeOverlay: require('./show-save-on-change-overlay'),
  showHelpOverlay: require('./show-help-overlay'),
  hideOverlay: require('./hide-overlay'),
  // terminal creators
  rxOn: require('./rx-on'),
  rxOff: require('./rx-off'),
  txOn: require('./tx-on'),
  txOff: require('./tx-off'),
  receive: require('./receive'),
  transmit: require('./transmit'),
  updateDuration: require('./update-duration'),
  clearTransmission: require('./clear-transmission'),
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
  updateDownloadProgress: require('./update-download-progress'),
  // action queue creators
  queueNewFile: require('./queue-new-file'),
  queueChangeFile: require('./queue-change-file'),
  queueOverwriteFile: require('./queue-overwrite-file'),
  resetActionQueue: require('./reset-action-queue')
};

module.exports = creators;
