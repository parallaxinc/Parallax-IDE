'use strict';

const alt = require('../alt');

class ProjectActions {
  clearName() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }
}

module.exports = alt.createActions(ProjectActions);
