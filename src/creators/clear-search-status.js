'use strict';

const {
  CLEAR_SEARCH_STATUS
} = require('../constants/action-types');

function clearSearchStatus(){
  return {
    type: CLEAR_SEARCH_STATUS,
    payload: {}
  };
}

module.exports = clearSearchStatus;
