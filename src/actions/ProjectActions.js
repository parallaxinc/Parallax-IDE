'use strict';

const alt = require('../alt');

class ProjectActions {
  constructor() {
    this.generateActions(
      'clearName',
      'updateName'
    );
  }
}

module.exports = alt.createActions(ProjectActions);
