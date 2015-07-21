'use strict';

const alt = require('../alt');

const { clearName, updateName, changeProject, deleteProject, confirmDelete } = require('../actions/project');

class ProjectStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onUpdateName: updateName,
      onChangeProject: changeProject,
      onDeleteProject: deleteProject,
      onConfirmDelete: confirmDelete
    });

    this.state = {
      projectName: '',
      deleteProjectName: ''
    };
  }

  onClearName() {
    this.setState({ projectName: '' });
  }

  onUpdateName(value) {
    this.setState({ projectName: value });
  }

  onConfirmDelete(projectName){
    this.setState({ deleteProjectName: projectName });
  }

  onChangeProject(projectName){
    const { workspace, config } = this.getInstance();

    if(!projectName){
      return;
    }

    workspace.changeDirectory(projectName)
      .then(() => {
        config.set('cwd', projectName);
        this.onClearName();
      });
  }

  onDeleteProject(projectName){
    const { workspace } = this.getInstance();

    if(!projectName){
      return;
    }

    workspace.deleteDirectory(projectName)
      .then(() => {
        this.onClearName();
      });
  }
}

ProjectStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ProjectStore);
