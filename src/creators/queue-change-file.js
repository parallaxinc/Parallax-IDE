'use strict';

const {
  QUEUE_CHANGE_FILE
} = require('../constants/action-types');

function queueChangeFile(filename){
  return {
    type: QUEUE_CHANGE_FILE,
    payload: {
      filename
    }
  };
}

module.exports = queueChangeFile;
