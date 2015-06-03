'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const Project = require('../project');
const ProjectList = require('../project-list');

const ProjectActions = require('../../../src/actions/ProjectActions.js');
const ProjectStore = require('../../../src/stores/ProjectStore.js');

const { createContainer } = require('sovereign');

const styles = require('../styles');

class ProjectOverlay extends React.Component {
  constructor(){

    this._onAccept = this._onAccept.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._newProject = this._newProject.bind(this);
  }

  render(){
    const space = this.props.workspace;
    const projects = space.projects;
    const cwd = space.cwd.deref().substr(1);

    return (
      <Card styles={[styles.overlay, styles.overlayLarge]}>
        <h3 style={styles.overlayTitle}>Open an existing project.</h3>
        <ProjectList>
          {projects.map((name) => <Project
            key={name}
            onSelect={this._onAccept}
            onDelete={this._onDelete}
            current={name === cwd}
            name={name} />)}
        </ProjectList>
        <h3 style={styles.overlayTitle}>Or start a brand new one.</h3>
        <TextField
          value={this.props.projectName}
          placeHolder="project name"
          styles={styles.textField}
          floatingLabel
          onChange={ProjectActions.updateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this._newProject}>Create</Button>
          <Button onClick={this._onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }

  _newProject(){
    this._onAccept(this.props.projectName);
  }

  _onAccept(name, evt){
    ProjectActions.clearName();
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(name, evt);
    }
  }

  _onCancel(evt){
    ProjectActions.clearName();
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  _onDelete(name, evt){
    evt.stopPropagation();
    evt.preventDefault();

    if(typeof this.props.onDelete === 'function'){
      this.props.onDelete(name, evt);
    }
  }

}

const ProjectOverlayContainer = createContainer(ProjectOverlay, {
  getStores(){
    return {
      ProjectStore: ProjectStore
    };
  },

  getPropsFromStores() {
    return ProjectStore.getState();
  }
});


module.exports = ProjectOverlayContainer;
