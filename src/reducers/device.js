'use strict';

const _ = require('lodash');

const {
  CONNECT,
  DISCONNECT
} = require('../constants/action-types');

const initial = {
  connected: false
};

function device(state = initial, { type, payload }){
  switch(type){
    case CONNECT:
      return _.assign({}, state, { connected: true });
    case DISCONNECT:
      return _.assign({}, state, { connected: false });
    default:
      return state;
  }
}

module.exports = device;
