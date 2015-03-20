'use strict';

const React = require('react');
const { Menu, MainButton, ChildButton } = require('react-mfb-iceddev');

require('react-mfb-iceddev/mfb.css');

const NewFileOverlay = require('./overlays/new-file');
const DeleteFileOverlay = require('./overlays/delete-file');

const FileOperations = React.createClass({
  saveFile: function(evt){
    evt.preventDefault();

    const space = this.props.workspace;

    // TODO: these should transparently accept cursors for all non-function params
    space.saveFile(space.filename.deref(), space.current, function(err){
      console.log('saved', err);
    });
  },
  createFile: function(name){
    const space = this.props.workspace;
    const overlay = this.props.overlay;

    if(!name){
      return;
    }

    space.filename.update(() => name);
    space.current.update(() => '');
    // TODO: these should transparently accept cursors for all non-function params
    space.saveFile(space.filename.deref(), space.current, overlay.hide);
  },
  deleteFile: function(name){
    const space = this.props.workspace;
    const overlay = this.props.overlay;

    if(!name){
      return;
    }

    space.deleteFile(space.filename, overlay.hide);
  },
  showCreateOverlay: function(evt){
    evt.preventDefault();

    const overlay = this.props.overlay;

    overlay.content(
      <NewFileOverlay
        onAccept={this.createFile}
        onCancel={overlay.hide} />
    );

    overlay.show({ backdrop: true });
  },
  showDeleteOverlay: function(evt){
    evt.preventDefault();

    const space = this.props.workspace;
    const overlay = this.props.overlay;

    overlay.content(
      <DeleteFileOverlay
        filename={space.filename.deref()}
        onAccept={this.deleteFile}
        onCancel={overlay.hide} />
    );

    overlay.show({ backdrop: true });
  },
  render: function(){
    return (
      <Menu effect="zoomin" method="click" position="bl">
        <MainButton iconResting="ion-plus-round" iconActive="ion-close-round" />
        <ChildButton
          onClick={this.showDeleteOverlay}
          icon="ion-backspace-outline"
          label="Delete File" />
        <ChildButton
          onClick={this.saveFile}
          icon="ion-compose"
          label="Save File" />
        <ChildButton
          onClick={this.showCreateOverlay}
          icon="ion-document"
          label="New File" />
      </Menu>
    );
  }
});

module.exports = FileOperations;
