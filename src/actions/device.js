'use strict';

const alt = require('../alt');

class DeviceActions {
  download(handleSuccess, handleError, handleComplete) {
    this.dispatch({ handleSuccess, handleError, handleComplete });
  }

  reloadDevices() {
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
