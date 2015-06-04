'use strict';

const alt = require('../alt');

const projectActions = require('../actions/ProjectActions.js');

class ProjectStore {
  constructor() {

    this.bindListeners({
      onClearName: projectActions.clearName,
      onUpdateName: projectActions.updateName
    });

    this.state = {
      projectName: ''
    };

  }

  onClearName() {
    this.setState({
      projectName: ''
    });
  }

  onUpdateName(value) {
    this.setState({
      projectName: value
    });
  }

}

ProjectStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ProjectStore);
