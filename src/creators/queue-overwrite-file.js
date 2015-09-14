'use strict';

const {
  QUEUE_OVERWRITE_FILE
} = require('../constants/action-types');

function queueOverwriteFile(filename){
  return {
    type: QUEUE_OVERWRITE_FILE,
    payload: {
      filename
    }
  };
}

module.exports = queueOverwriteFile;
