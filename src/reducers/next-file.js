'use strict';

const {
  RESET_FILE_QUEUE,
  QUEUE_FILE_CHANGE
} = require('../constants/action-types');

const initial = '';

function nextFile(state = initial, { type, payload }){
  switch(type){
    case QUEUE_FILE_CHANGE:
      return payload.filename;
    case RESET_FILE_QUEUE:
      return initial;
    default:
      return state;
  }
}

module.exports = nextFile;
