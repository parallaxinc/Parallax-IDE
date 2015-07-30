'use strict';

const _ = require('lodash');
const React = require('react');
const { createContainer } = require('sovereign');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const Overlay = require('../components/overlay');
const OverlayTitle = require('../components/overlay-title');
const OverlayFooter = require('../components/overlay-footer');
const ProjectList = require('../components/project-list');
const ProjectListItem = require('../components/project-list-item');
const DeleteButton = require('../components/delete-button');

const { confirmDelete, changeProject } = require('../actions/project');
const { hideProjects } = require('../actions/overlay');

const styles = {
  textField: {
    containerStyling: {
      width: '100%'
    }
  }
};

function componentizeProject(cwd, { name, fullPath }){
  function onAccept(){
    // clearName();
    changeProject(name);
  }

  function onDelete(evt){
    evt.preventDefault();
    evt.stopPropagation();

    confirmDelete(name);
  }

  if(cwd === fullPath){
    return (
      <ProjectListItem>
        {name}
      </ProjectListItem>
    );
  } else {
    return (
      <ProjectListItem onClick={onAccept}>
        {name} <DeleteButton onClick={onDelete} />
      </ProjectListItem>
    );
  }
}

class ProjectOverlay extends React.Component {
  constructor(){
    this.state = {
      projectName: ''
    };

    this.updateName = this.updateName.bind(this);
    this.clearName = this.clearName.bind(this);
    this.create = this.create.bind(this);
    this.close = this.close.bind(this);
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
    const { projectName } = this.state;

    this.clearName();
    changeProject(projectName);
  }

  close(){
    this.clearName();
    hideProjects();
  }

  render(){
    const {
      cwd,
      projects
    } = this.props;

    const {
      projectName
    } = this.state;

    return (
      <Overlay large>
        <OverlayTitle>Open an existing project.</OverlayTitle>
        <ProjectList>
          {_.map(projects, (...args) => componentizeProject(cwd, ...args))}
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
