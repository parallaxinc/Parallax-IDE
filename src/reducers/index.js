'use strict';

const reducers = {
  deleteProjectName: require('./delete-project-name'),
  overlayState: require('./overlay-state'),
  transmission: require('./transmission'),
  device: require('./device'),
  deviceList: require('./device-list'),
  downloadProgress: require('./download-progress'),
  nextFile: require('./next-file'),
  nextAction: require('./next-action')
};

module.exports = reducers;
