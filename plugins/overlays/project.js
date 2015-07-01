'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');
const { createContainer } = require('sovereign');

const ProjectList = require('./project-list');
const ProjectItem = require('./project-item');
const projectStore = require('../../src/stores/project');
const { clearName, updateName } = require('../../src/actions/project');

const styles = require('./styles');

class ProjectOverlay extends React.Component {
  constructor(){

    this._onAccept = this._onAccept.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._newProject = this._newProject.bind(this);
    this._onUpdateName = this._onUpdateName.bind(this);
  }

  render(){
    const space = this.props.workspace;
    const projects = space.projects;
    const cwd = space.cwd.deref().substr(1);
    const { projectName } = this.props;

    return (
      <Card styles={[styles.overlay, styles.overlayLarge]}>
        <h3 style={styles.overlayTitle}>Open an existing project.</h3>
        <ProjectList>
          {projects.map((name) => <ProjectItem
            key={name}
            onSelect={this._onAccept}
            onDelete={this._onDelete}
            current={name === cwd}
            name={name} />)}
        </ProjectList>
        <h3 style={styles.overlayTitle}>Or start a brand new one.</h3>
        <TextField
          value={projectName}
          placeHolder="project name"
          styles={styles.textField}
          floatingLabel
          onChange={this._onUpdateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this._newProject}>Create</Button>
          <Button onClick={this._onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }

  _onUpdateName(evt){
    const { value } = evt.target;

    updateName(value);
  }

  _newProject(){
    const { projectName } = this.props;

    this._onAccept(projectName);
  }

  _onAccept(name, evt){
    const { onAccept } = this.props;

    clearName();
    if(typeof onAccept === 'function'){
      onAccept(name, evt);
    }
  }

  _onCancel(evt){
    const { onCancel } = this.props;

    clearName();
    if(typeof onCancel === 'function'){
      onCancel(evt);
    }
  }

  _onDelete(name, evt){
    const { onDelete } = this.props;

    evt.stopPropagation();
    evt.preventDefault();

    if(typeof onDelete === 'function'){
      onDelete(name, evt);
    }
  }

}

module.exports = createContainer(ProjectOverlay, {
  getStores(){
    return {
      projectStore: projectStore
    };
  },

  getPropsFromStores() {
    return projectStore.getState();
  }
});
