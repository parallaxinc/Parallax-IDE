'use strict';

const {
  UPDATE_DURATION
} = require('../constants/action-types');

function updateDuration(duration){
  return {
    type: UPDATE_DURATION,
    payload: {
      duration
    }
  };
}

module.exports = updateDuration;
