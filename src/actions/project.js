'use strict';

const alt = require('../alt');

class ProjectActions {
  clearName() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }

  confirmDelete(name){
    this.dispatch(name);
  }

  changeProject(name){
    this.dispatch(name);
  }

  deleteProject(name){
    this.dispatch(name);
  }
}

module.exports = alt.createActions(ProjectActions);
