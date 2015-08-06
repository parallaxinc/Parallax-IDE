'use strict';

const {
  CONNECT
} = require('../constants/action-types');

function connect(){
  return {
    type: CONNECT,
    payload: {}
  };
}

module.exports = connect;
