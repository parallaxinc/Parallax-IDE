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

class SidebarView extends React.Component {

  constructor(...args){
    super(...args);

    this.download = this.download.bind(this);
    this.componentizeFile = this.componentizeFile.bind(this);
  }

  componentDidMount(){
    const { workspace } = this.props;
    // TODO: move into frylord?
    if(typeof chrome !== 'undefined' && typeof chrome.syncFileSystem !== 'undefined'){
      chrome.syncFileSystem.onFileStatusChanged.addListener(function(detail){
        if(detail.direction === 'remote_to_local'){
          workspace.refreshDirectory();
        }
      });
      chrome.syncFileSystem.onServiceStatusChanged.addListener(function(){
        workspace.refreshDirectory();
      });
    }
  }

  download(){
    const {
      enableAutoDownload,
      showDownloadOverlay
    } = this.props.handlers;

    enableAutoDownload();
    showDownloadOverlay();
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
          <FileOperationListItem onClick={this.download} icon="ion-code-download" label="Download" />
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
