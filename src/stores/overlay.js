'use strict';

const alt = require('../alt');

const fileStore = require('./file');
const { deleteFile, saveFile, saveFileAs, loadFile } = require('../actions/file');
const { confirmDelete, changeProject, deleteProject } = require('../actions/project');
const {
  hideOverlays,
  showSave,
  hideSave,
  showDelete,
  hideDelete,
  showDownload,
  hideDownload,
  showOverwrite,
  hideOverwrite,
  showProjects,
  hideProjects,
  showProjectDelete } = require('../actions/overlay');

class OverlayStore {
  constructor(){

    this.bindListeners({
      onHideOverlays: hideOverlays,
      onSaveBeforeLoad: loadFile,
      onSaveNewFile: saveFile,
      onShowSave: showSave,
      onHideSave: [saveFileAs, hideSave],
      onShowDelete: showDelete,
      onHideDelete: [hideDelete, deleteFile],
      onShowDownload: showDownload,
      onHideDownload: hideDownload,
      onShowOverwrite: showOverwrite,
      onHideOverwrite: hideOverwrite,
      onShowProjects: [deleteProject, showProjects],
      onHideProjects: [changeProject, hideProjects],
      onShowProjectDelete: [confirmDelete, showProjectDelete]
    });

    this.state = {
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    };
  }

  onHideOverlays(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    });
  }

  onShowOverwrite() {
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: true,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    });
  }

  onHideOverwrite() {
    this.setState({
      showOverwriteOverlay: false,
      showSaveOverlay: true
    });
  }

  onSaveBeforeLoad(){
    // TODO: don't really like this
    const { workspace } = fileStore;
    const { isNewFile } = fileStore.getState();
    const content = workspace.current.deref();

    if(isNewFile && content.length){
      this.onShowSave();
    }
  }

  onSaveNewFile(){
    const { isNewFile } = fileStore.getState();

    if(isNewFile){
      this.onShowSave();
    }
  }

  onShowSave(){
    this.setState({
      showSaveOverlay: true,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    });
  }

  onHideSave(){
    this.setState({
      showSaveOverlay: false
    });
  }

  onShowDelete(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: true,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    });
  }

  onHideDelete(){
    this.setState({
      showDeleteOverlay: false
    });
  }

  onShowDownload(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: true,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: false
    });
  }

  onHideDownload(){
    this.setState({
      showDownloadOverlay: false
    });
  }

  onShowProjects(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: true,
      showProjectDeleteOverlay: false
    });
  }

  onHideProjects(){
    // TODO: don't close on empty project name
    this.setState({
      showProjectsOverlay: false
    });
  }

  onShowProjectDelete(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false,
      showOverwriteOverlay: false,
      showProjectsOverlay: false,
      showProjectDeleteOverlay: true
    });
  }
}

OverlayStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(OverlayStore);
