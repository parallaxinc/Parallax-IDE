'use strict';

const {
  QUEUE_FILE_CHANGE
} = require('../constants/action-types');

function queueFileChange(filename){
  return {
    type: QUEUE_FILE_CHANGE,
    payload: {
      filename
    }
  };
}

module.exports = queueFileChange;
