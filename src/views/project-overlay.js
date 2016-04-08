'use strict';

const _ = require('lodash');
const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('../components/button');
const TextField = require('react-material/components/TextField');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');
const ProjectList = require('../components/project-list');
const ProjectListItem = require('../components/project-list-item');
const DeleteButton = require('../components/delete-button');

const styles = {
  textField: {
    containerStyling: {
      width: '100%'
    }
  }
};

class ProjectOverlay extends React.Component {
  constructor(){
    this.state = {
      projectName: ''
    };

    this.componentizeProject = this.componentizeProject.bind(this);
    this.updateName = this.updateName.bind(this);
    this.clearName = this.clearName.bind(this);
    this.create = this.create.bind(this);
    this.close = this.close.bind(this);
  }

  componentizeProject({ name, fullPath }){
    const self = this;

    const {
      cwd,
      handlers
    } = this.props;

    const {
      hideOverlay,
      changeProject,
      deleteProjectConfirm
    } = handlers;

    function onAccept(){
      changeProject(name);
      hideOverlay();
      self.clearName();
    }

    function onDelete(evt){
      evt.preventDefault();
      evt.stopPropagation();

      deleteProjectConfirm(name);
    }

    if(cwd === fullPath){
      return (
        <ProjectListItem key={name}>
          {name}
        </ProjectListItem>
      );
    } else {
      return (
        <ProjectListItem key={name} onClick={onAccept}>
          {name} <DeleteButton onClick={onDelete} />
        </ProjectListItem>
      );
    }
  }

  updateName(evt){
    const { value } = evt.target;

    this.setState({
      projectName: value
    });
  }

  clearName(){
    this.setState({
      projectName: ''
    });
  }

  create(){
    const {
      changeProject,
      hideOverlay
    } = this.props.handlers;

    const { projectName } = this.state;

    changeProject(projectName);
    hideOverlay();
    this.clearName();
  }

  close(){
    const { hideOverlay } = this.props.handlers;

    hideOverlay();
    this.clearName();
  }

  render(){
    const {
      projects
    } = this.props;

    const {
      projectName
    } = this.state;

    return (
      <Overlay large>
        <OverlayTitle>Open an existing project.</OverlayTitle>
        <ProjectList>
          {_.map(projects, this.componentizeProject)}
        </ProjectList>
        <OverlayTitle>Or start a brand new one.</OverlayTitle>
        <TextField
          value={projectName}
          placeHolder="project name"
          styles={styles.textField}
          floatingLabel
          onChange={this.updateName} />
        <OverlayFooter>
          <Button onClick={this.create}>Create</Button>
          <Button onClick={this.close}>Cancel</Button>
        </OverlayFooter>
      </Overlay>
    );
  }
}

module.exports = createContainer(ProjectOverlay, {
  getStores({ workspace }){
    return {
      workspace
    };
  },

  getPropsFromStores({ workspace }){
    const { cwd, projects } = workspace.getState();

    return {
      cwd,
      projects
    };
  }
});
