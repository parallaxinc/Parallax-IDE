'use strict';

const alt = require('../alt');

class DeviceActions {

  reloadDevices() {
    this.dispatch();
  }

  enableAuto() {
    this.dispatch();
  }

  disableAuto() {
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
