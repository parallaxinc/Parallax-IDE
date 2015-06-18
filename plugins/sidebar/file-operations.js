'use strict';

const React = require('react');
const { Menu, MainButton, ChildButton } = require('react-mfb-iceddev');

require('react-mfb-iceddev/mfb.css');

const NewFileOverlay = require('./overlays/new-file');
const DownloadOverlay = require('./overlays/download');
const DeleteConfirmOverlay = require('./overlays/delete-confirm');
const { reloadDevices } = require('../../src/actions/device.js');
const { clearName, deleteFile, newFile, processSave, hideOverlay } = require('../../src/actions/file');

const styles = require('./styles');

const FileOperations = React.createClass({
  handleError: function(err){
    // leaving this in for better debugging of errors
    console.log(err);
    const toast = this.props.toast;

    toast.show(err.message, { style: styles.errorToast });
  },
  handleSuccess: function(msg){
    const toast = this.props.toast;

    toast.show(msg, { style: styles.successToast, timeout: 5000 });
  },
  renderOverlay: function(component){
    const overlay = this.props.overlay;

    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  },
  showDeleteOverlay: function(evt){
    evt.preventDefault();

    const space = this.props.workspace;

    const name = space.filename.deref();

    if(!name){
      return;
    }

    const component = (
      <DeleteConfirmOverlay
        name={name}
        onAccept={deleteFile}
        onCancel={hideOverlay} />
    );

    this.renderOverlay(component);
  },
  showDownloadOverlay: function(evt){
    evt.preventDefault();

    reloadDevices();

    const component = (
      <DownloadOverlay
        onCancel={hideOverlay}
        irken={this.props.irken}
        handleSuccess={this.handleSuccess}
        handleError={this.handleError} />
    );

    this.renderOverlay(component);
  },
  render: function(){
    return (
      <Menu effect="zoomin" method="click" position="bl">
        <MainButton
          iconResting="ion-plus-round"
          iconActive="ion-close-round" />
        <ChildButton
          onClick={this.showDownloadOverlay}
          icon="ion-code-download"
          label="Download" />
        <ChildButton
          onClick={this.showDeleteOverlay}
          icon="ion-backspace-outline"
          label="Delete File" />
        <ChildButton
          onClick={processSave}
          icon="ion-compose"
          label="Save File" />
        <ChildButton
          onClick={newFile}
          icon="ion-document"
          label="New File" />
      </Menu>
    );
  }
});

module.exports = FileOperations;
