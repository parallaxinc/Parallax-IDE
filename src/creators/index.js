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
  updateDuration: require('./update-duration')
};

module.exports = creators;