'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const Project = require('../project');
const ProjectList = require('../project-list');

const styles = require('../styles');

class ProjectOverlay extends React.Component {
  constructor(){
    this.state = {
      value: ''
    };

    this.updateName = this.updateName.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.newProject = this.newProject.bind(this);
  }

  updateName(evt){
    this.setState({
      value: evt.target.value
    });
  }

  clearName(){
    this.setState({
      value: ''
    });
  }

  newProject(){
    this.onAccept(this.state.value);
  }

  onAccept(name, evt){
    this.clearName();
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(name, evt);
    }
  }

  onCancel(evt){
    this.clearName();
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  onDelete(name, evt){
    evt.stopPropagation();
    evt.preventDefault();

    if(typeof this.props.onDelete === 'function'){
      this.props.onDelete(name, evt);
    }
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
            onSelect={this.onAccept}
            onDelete={this.onDelete}
            current={name === cwd}
            name={name} />)}
        </ProjectList>
        <h3 style={styles.overlayTitle}>Or start a brand new one.</h3>
        <TextField
          value={this.state.value}
          placeHolder="project name"
          styles={styles.textField}
          floatingLabel
          onChange={this.updateName} />
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this.newProject}>Create</Button>
          <Button onClick={this.onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }
}

module.exports = ProjectOverlay;
