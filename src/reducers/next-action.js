'use strict';

const {
  QUEUE_NEW_FILE,
  QUEUE_CHANGE_FILE,
  QUEUE_OVERWRITE_FILE,
  RESET_ACTION_QUEUE
} = require('../constants/action-types');

const {
  NEW_FILE,
  CHANGE_FILE,
  OVERWRITE_FILE
} = require('../constants/queued-action-types');

const initial = '';

function nextAction(state = initial, { type }){
  switch(type){
    case QUEUE_NEW_FILE:
      return NEW_FILE;
    case QUEUE_CHANGE_FILE:
      return CHANGE_FILE;
    case QUEUE_OVERWRITE_FILE:
      return OVERWRITE_FILE;
    case RESET_ACTION_QUEUE:
      return initial;
    default:
      return state;
  }
}

module.exports = nextAction;
