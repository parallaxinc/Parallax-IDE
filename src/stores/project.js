'use strict';

const alt = require('../alt');

const { clearName, updateName } = require('../actions/project');

class ProjectStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onUpdateName: updateName
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
