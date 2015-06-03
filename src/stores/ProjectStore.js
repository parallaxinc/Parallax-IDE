'use strict';

const alt = require('../alt');

const ProjectActions = require('../actions/ProjectActions.js');

class ProjectStore {
  constructor() {

    this.bindActions(ProjectActions);

    this.state = {
      projectName: ''
    };

  }

  onClearName() {
    this.setState({
      projectName: ''
    });
  }

  onUpdateName(evt) {
    this.setState({
      projectName: evt.target.value
    });
  }

}

ProjectStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ProjectStore);
