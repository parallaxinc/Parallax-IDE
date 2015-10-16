'use strict';

/*
  Don't include this in the index.js because it is used only
  for the console-store
 */

const {
  ECHO_OFF,
  ECHO_ON
} = require('../constants/action-types');

const initial = false;

function echo(state = initial, { type }){
  switch(type){
    case ECHO_OFF:
      return false;
    case ECHO_ON:
      return true;
    default:
      return state;
  }
}

module.exports = echo;
