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

const { loadFile, newFile, saveFile } = require('../actions/file');
const { showProjects, showDelete, showDownload } = require('../actions/overlay');
const { enableAuto } = require('../../src/actions/device');

function download(){
  enableAuto();
  showDownload();
}

function componentizeFile({ name, temp }){
  return (
    <FileListItem key={name} filename={name} temp={temp} onClick={() => loadFile(name)} />
  );
}

class SidebarView extends React.Component {
  render(){
    const {
      cwd,
      directory
    } = this.props;

    return (
      <Sidebar>
        <ProjectsButton onClick={showProjects} />
        <FileList>
          <ListItem icon="folder" disableRipple>{cwd}</ListItem>
          {_.map(directory, componentizeFile)}
        </FileList>
        <FileOperationList>
          <FileOperationListItem onClick={download} icon="ion-code-download" label="Download" />
          <FileOperationListItem onClick={showDelete} icon="ion-backspace-outline" label="Delete File" />
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
