'use strict';

const alt = require('../alt');

class DeviceActions {

  reloadDevices() {
    this.dispatch();
  }

  disableAuto() {
    this.dispatch();
  }

  enableAuto(){
    this.dispatch();
  }

  updateSelected(device) {
    this.dispatch(device);
  }
}

module.exports = alt.createActions(DeviceActions);
