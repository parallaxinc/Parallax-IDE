'use strict';

const {
  DELETE_PROJECT_CONFIRM
} = require('../constants/action-types');

const initial = '';

function deleteProjectName(state = initial, { type, payload }){
  switch(type){
    case DELETE_PROJECT_CONFIRM:
      return payload.name;
    default:
      return state;
  }
}

module.exports = deleteProjectName;
