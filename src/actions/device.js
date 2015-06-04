'use strict';

const alt = require('../alt');

class DeviceActions {
  download(handleSuccess, handleError) {
    this.dispatch({ handleSuccess, handleError });
  }

  reloadDevices() {
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
