'use strict';

const React = require('react');
const { MainButton } = require('react-mfb-iceddev');

const ProjectOverlay = require('./overlays/project');
const DeleteConfirmOverlay = require('../overlays/delete-confirm');

const styles = require('./styles');

class ProjectOperations extends React.Component {

  constructor(){
    this.renderOverlay = this.renderOverlay.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
    this.changeProject = this.changeProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.showProjectOverlay = this.showProjectOverlay.bind(this);
    this.showDeleteOverlay = this.showDeleteOverlay.bind(this);
  }

  changeProject(projectName){
    const space = this.props.workspace;
    const config = this.props.config;

    if(!projectName){
      return;
    }

    space.changeDir(projectName, () => {
      config.set('cwd', projectName);
      // TODO: handle error
      this.hideOverlay();
    });
  }

  deleteProject(projectName){
    const space = this.props.workspace;

    if(!projectName){
      return;
    }

    space.deleteDir(projectName, () => {
      // TODO: handle error
      this.showProjectOverlay();
    });
  }

  renderOverlay(component){
    const overlay = this.props.overlay;

    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  }

  hideOverlay(){
    const overlay = this.props.overlay;
    overlay.hide();
  }

  showProjectOverlay(evt){
    if(evt && typeof evt.preventDefault === 'function'){
      evt.preventDefault();
    }

    const space = this.props.workspace;

    const component = (
      <ProjectOverlay
        workspace={space}
        onAccept={this.changeProject}
        onDelete={this.showDeleteOverlay}
        onCancel={this.hideOverlay} />
    );

    this.renderOverlay(component);
  }

  showDeleteOverlay(projectName){
    const component = (
      <DeleteConfirmOverlay
        name={projectName}
        onAccept={this.deleteProject}
        onCancel={this.hideOverlay} />
    );

    this.renderOverlay(component);
  }

  componentDidMount(){
    this.remove_showProjectOverlay = app.keypress(app.keypress.CTRL_O, this.showProjectOverlay);
    this.remove_closeDialog = app.keypress(app.keypress.ESC, this.hideOverlay);
  }

  componentWillUnmount(){
    if(this.remove_showProjectOverlay) {
     this.remove_showProjectOverlay();
    };
    if(this.remove_closeDialog) {
     this.remove_closeDialog();
    };

  }

  render(){
    return (
      <div className="mfb-component--tl" data-mfb-toggle="hover" style={styles.changeFolderButton}>
        <MainButton
          iconResting="ion-folder"
          iconActive="ion-folder"
          label="Change Project"
          onToggleMenu={this.showProjectOverlay} />
      </div>
    );
  }
}

module.exports = ProjectOperations;
