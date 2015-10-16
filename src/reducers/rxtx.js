'use strict';

/*
  Don't include this in the index.js because it is used only
  for the console-store
 */

const _ = require('lodash');

const {
  RX_ON,
  RX_OFF,
  RX_CLEAR_TIMEOUT,
  TX_ON,
  TX_OFF,
  TX_CLEAR_TIMEOUT,
  UPDATE_DURATION
} = require('../constants/action-types');

const initial = {
  flashRx: false,
  rxTimeout: null,
  flashTx: false,
  txTimeout: null,
  duration: 100,
  offDuration: 50
};

function rxtx(state = initial, { type, payload }){
  switch(type){
    case RX_ON:
      return _.assign({}, state, { flashRx: true, rxTimeout: payload.timeout });
    case RX_OFF:
      return _.assign({}, state, { flashRx: false });
    case RX_CLEAR_TIMEOUT:
      return _.assign({}, state, { flashRx: false, rxTimeout: null });
    case TX_ON:
      return _.assign({}, state, { flashTx: true, txTimeout: payload.timeout });
    case TX_OFF:
      return _.assign({}, state, { flashTx: false });
    case TX_CLEAR_TIMEOUT:
      return _.assign({}, state, { flashTx: false, txTimeout: null });
    case UPDATE_DURATION:
      return _.assign({}, state, { duration: payload.duration });
    default:
      return state;
  }
}

module.exports = rxtx;
