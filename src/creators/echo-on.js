'use strict';

const {
  ECHO_ON
} = require('../constants/action-types');

function echoOn(){
  return {
    type: ECHO_ON,
    payload: {}
  };
}

module.exports = echoOn;
