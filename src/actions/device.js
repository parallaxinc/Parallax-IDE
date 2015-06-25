'use strict';

const alt = require('../alt');

class DeviceActions {
  download(handleSuccess, handleError) {
    this.dispatch({ handleSuccess, handleError });
  }

  reloadDevices() {
    this.dispatch();
  }

  noDownload() {
    this.dispatch();
  }

  showDownload() {
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
