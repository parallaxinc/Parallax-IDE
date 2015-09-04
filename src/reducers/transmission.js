'use strict';

const _ = require('lodash');

const {
  RECEIVE,
  TRANSMIT,
  CLEAR_TRANSMISSION,
  CONNECT
} = require('../constants/action-types');

const initial = {
  input: '',
  // output is an array of lines
  output: [],
  // offset is number of lines cleared from console buffer
  offset: 0
};

function transmission(state = initial, { type, payload }){
  switch(type){
    case CONNECT:
      return _.assign({}, state, { input: '' });
    case RECEIVE:
      return _.assign({}, state, { output: payload.output, offset: payload.offset });
    case TRANSMIT:
      return _.assign({}, state, { input: payload.input });
    case CLEAR_TRANSMISSION:
      return _.assign({}, state, { input: '', output: '' });
    default:
      return state;
  }
}

module.exports = transmission;
