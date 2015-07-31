'use strict';

const {
  DELETE_PROJECT_CONFIRM
} = require('../constants/action-types');

function deleteProjectConfirm(name){
  return {
    type: DELETE_PROJECT_CONFIRM,
    payload: {
      name
    }
  };
}

module.exports = deleteProjectConfirm;
