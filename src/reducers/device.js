'use strict';

const _ = require('lodash');

const {
  CONNECT,
  DISCONNECT,
  RELOAD_DEVICES,
  UPDATE_DEVICES,
  ENABLE_AUTO_DOWNLOAD,
  DISABLE_AUTO_DOWNLOAD,
  UPDATE_SEARCH_STATUS,
  CLEAR_SEARCH_STATUS,
  UPDATE_SELECTED_DEVICE
} = require('../constants/action-types');

const initial = {
  path: null,
  selected: null,
  searching: true,
  connected: false,
  // TODO: not sure if this should be here
  autoDownload: true,
  // TODO: I don't think search status should be in here
  searchStatus: null
};

function device(state = initial, { type, payload }){
  switch(type){
    case CONNECT:
      return _.assign({}, state, { connected: true });
    case DISCONNECT:
      return _.assign({}, state, { connected: false });
    case RELOAD_DEVICES:
      return _.assign({}, state, { path: null, searching: true, searchStatus: null });
    case UPDATE_DEVICES:
      return _.assign({}, state, { searching: false });
    case ENABLE_AUTO_DOWNLOAD:
      return _.assign({}, state, { autoDownload: true });
    case DISABLE_AUTO_DOWNLOAD:
      return _.assign({}, state, { autoDownload: false });
    case UPDATE_SEARCH_STATUS:
      return _.assign({}, state, { searchStatus: payload.status });
    case CLEAR_SEARCH_STATUS:
      return _.assign({}, state, { searchStatus: payload.status });
    case UPDATE_SELECTED_DEVICE:
      // TODO: not sure if it is better to set searchStatus
      // to null when we update or dispatch a clear separately
      return _.assign({}, state, { selected: payload.device, path: payload.device.path, searchStatus: null });
    default:
      return state;
  }
}

module.exports = device;
