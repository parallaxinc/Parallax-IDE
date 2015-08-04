'use strict';

require('react-mfb-iceddev/mfb.css');

const _ = require('lodash');
const React = require('react');
const { createContainer } = require('sovereign');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('../components/sidebar');
const FileList = require('../components/file-list');
const FileListItem = require('../components/file-list-item');
const ProjectsButton = require('../components/projects-button');
const FileOperationList = require('../components/file-operation-list');
const FileOperationListItem = require('../components/file-operation-list-item');

const { showDownload } = require('../actions/overlay');
const { enableAuto } = require('../../src/actions/device');

function download(){
  enableAuto();
  showDownload();
}

class SidebarView extends React.Component {

  constructor(...args){
    super(...args);

    this.componentizeFile = this.componentizeFile.bind(this);
  }

  componentizeFile({ name, temp }){
    const { changeFile } = this.props.handlers;

    return (
      <FileListItem key={name} filename={name} temp={temp} onClick={() => changeFile(name)} />
    );
  }

  render(){
    const {
      cwd,
      directory,
      handlers
    } = this.props;

    const {
      newFile,
      saveFile,
      showProjectsOverlay,
      showDeleteFileOverlay
    } = handlers;

    return (
      <Sidebar>
        <ProjectsButton onClick={showProjectsOverlay} />
        <FileList>
          <ListItem icon="folder" disableRipple>{cwd}</ListItem>
          {_.map(directory, this.componentizeFile)}
        </FileList>
        <FileOperationList>
          <FileOperationListItem onClick={download} icon="ion-code-download" label="Download" />
          <FileOperationListItem onClick={showDeleteFileOverlay} icon="ion-backspace-outline" label="Delete File" />
          <FileOperationListItem onClick={saveFile} icon="ion-compose" label="Save File" />
          <FileOperationListItem onClick={newFile} icon="ion-document" label="New File" />
        </FileOperationList>
      </Sidebar>
    );
  }
}

module.exports = createContainer(SidebarView, {
  getStores({ workspace }){
    return {
      workspace
    };
  },

  getPropsFromStores({ workspace }){
    const { cwd, directory } = workspace.getState();

    return {
      cwd,
      directory
    };
  }
});
