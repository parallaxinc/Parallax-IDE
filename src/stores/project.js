'use strict';

const path = require('path');

const alt = require('../alt');

const { changeProject, deleteProject, confirmDelete } = require('../actions/project');

class ProjectStore {
  constructor() {

    this.bindListeners({
      onChangeProject: changeProject,
      onDeleteProject: deleteProject,
      onConfirmDelete: confirmDelete
    });

    this.state = {
      deleteProjectName: ''
    };
  }

  onConfirmDelete(projectName){
    this.setState({ deleteProjectName: projectName });
  }

  onChangeProject(projectName){
    const { workspace, config } = this.getInstance();

    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.changeDirectory(dirpath)
      .then(() => {
        config.set('cwd', dirpath);
      });
  }

  onDeleteProject(projectName){
    const { workspace } = this.getInstance();

    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.deleteDirectory(dirpath);
  }
}

ProjectStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ProjectStore);
