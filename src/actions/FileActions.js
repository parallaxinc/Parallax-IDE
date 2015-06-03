'use strict';

const alt = require('../alt');

class FileActions {
  constructor() {
    this.generateActions(
      'clearName',
      'updateName'
    );
  }
}

module.exports = alt.createActions(FileActions);
