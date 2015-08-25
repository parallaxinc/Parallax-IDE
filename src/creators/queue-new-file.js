'use strict';

const {
  QUEUE_NEW_FILE
} = require('../constants/action-types');

function queueNewFile(){
  return {
    type: QUEUE_NEW_FILE,
    payload: {}
  };
}

module.exports = queueNewFile;
