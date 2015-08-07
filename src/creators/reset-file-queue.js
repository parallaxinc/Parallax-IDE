'use strict';

const {
  RESET_FILE_QUEUE
} = require('../constants/action-types');

function resetFileQueue(){
  return {
    type: RESET_FILE_QUEUE,
    payload: {}
  };
}

module.exports = resetFileQueue;
