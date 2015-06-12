'use strict';

const alt = require('../alt');

class DeviceActions {
  download(handleSuccess, handleError) {
    this.dispatch({ handleSuccess, handleError });
  }

  progress(value) {
    this.dispatch(value);
  }

  reloadDevices() {
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
