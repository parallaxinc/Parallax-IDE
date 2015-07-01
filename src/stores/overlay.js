'use strict';

const alt = require('../alt');

const fileStore = require('./file');
const { download } = require('../actions/device');
const { deleteFile, saveFile, saveFileAs, loadFile } = require('../actions/file');
const {
  hideOverlays,
  showSave,
  hideSave,
  showDelete,
  hideDelete,
  showDownload,
  hideDownload } = require('../actions/overlay');

class OverlayStore {
  constructor(){

    this.bindListeners({
      onHideOverlays: hideOverlays,
      onSaveNewFile: [saveFile, loadFile],
      onShowSave: showSave,
      onHideSave: [saveFileAs, hideSave],
      onShowDelete: showDelete,
      onHideDelete: [hideDelete, deleteFile],
      onShowDownload: showDownload,
      onHideDownload: [download, hideDownload]
    });

    this.state = {
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false
    };
  }

  onHideOverlays(){
    this.setState({
      showSaveOverlay: false,
      showDeleteOverlay: false,
      showDownloadOverlay: false
    });
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
      showDownloadOverlay: false
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
      showDownloadOverlay: false
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
      showDownloadOverlay: true
    });
  }

  onHideDownload(){
    this.setState({
      showDownloadOverlay: false
    });
  }
}

OverlayStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(OverlayStore);
