'use strict';

const {
  RESET_ACTION_QUEUE
} = require('../constants/action-types');

function resetFileQueue(){
  return {
    type: RESET_ACTION_QUEUE,
    payload: {}
  };
}

module.exports = resetFileQueue;
