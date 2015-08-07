'use strict';

const {
  UPDATE_SEARCH_STATUS
} = require('../constants/action-types');

function updateSearchStatus(status){
  return {
    type: UPDATE_SEARCH_STATUS,
    payload: {
      status
    }
  };
}

module.exports = updateSearchStatus;
