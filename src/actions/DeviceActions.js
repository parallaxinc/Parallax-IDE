'use strict';

const alt = require('../alt');

class DeviceActions {
  constructor() {
    this.generateActions(
      'download',
      'reloadDevices',
      'updateSelected'
    );
  }
}

module.exports = alt.createActions(DeviceActions);
