'use strict';

const React = require('react');
const through = require('through2');
const { Menu, MainButton, ChildButton } = require('react-mfb-iceddev');

require('react-mfb-iceddev/mfb.css');

const NewFileOverlay = require('./overlays/new-file');
const DownloadOverlay = require('./overlays/download');
const DeleteConfirmOverlay = require('./overlays/delete-confirm');

const styles = require('./styles');

let boards = {};

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
  saveFile: function(evt){
    if(evt){
      evt.preventDefault();
    }

    const space = this.props.workspace;

    const name = space.filename.deref();

    // TODO: these should transparently accept cursors for all non-function params
    space.saveFile(name, space.current)
      .tap(() => this.handleSuccess(`'${name}' saved successfully`))
      .catch(this.handleError);
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
    space.saveFile(space.filename.deref(), space.current)
      .tap(() => this.handleSuccess(`'${name}' created successfully`))
      .catch(this.handleError)
      .finally(overlay.hide);
  },
  deleteFile: function(name){
    const space = this.props.workspace;
    const overlay = this.props.overlay;

    if(!name){
      return;
    }

    space.deleteFile(space.filename)
      .tap(() => this.handleSuccess(`'${name}' deleted successfully`))
      .catch(this.handleError)
      .finally(overlay.hide);
  },
  download: function(devicePath){
    const toast = this.props.toast;
    const space = this.props.workspace;
    const logger = this.props.logger;
    const overlay = this.props.overlay;
    const Board = this.props.Board;
    const name = space.filename.deref();
    const source = space.current.deref();

    if(!devicePath){
      return;
    }

    const boardOpts = {
      path: devicePath,
      revision: 'bs2',
      readAfterProgram: true
    };

    let board;
    if(boards[devicePath]){
      board = boards[devicePath];
    } else {
      board = boards[devicePath] = new Board(boardOpts);
    }

    const log = through(function(chunk, enc, cb){
      logger(chunk.toString());
      cb(null, chunk);
    });

    board.compile(source)
      .tap(() => logger.clear())
      .then((memory) => board.bootload(memory))
      .then(() => board.read().pipe(log))
      .tap(() => toast.clear())
      .tap(() => this.handleSuccess(`'${name}' downloaded successfully`))
      .catch(this.handleError)
      .finally(overlay.hide);
  },
  renderOverlay: function(component){
    const overlay = this.props.overlay;

    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  },
  hideOverlay: function(){
    const overlay = this.props.overlay;
    overlay.hide();
  },
  showCreateOverlay: function(evt){
    evt.preventDefault();

    const component = (
      <NewFileOverlay
        onAccept={this.createFile}
        onCancel={this.hideOverlay} />
    );

    this.renderOverlay(component);
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
        onAccept={this.deleteFile}
        onCancel={this.hideOverlay} />
    );

    this.renderOverlay(component);
  },
  showDownloadOverlay: function(evt){
    evt.preventDefault();

    const component = (
      <DownloadOverlay
        onAccept={this.download}
        onCancel={this.hideOverlay} />
    );

    this.renderOverlay(component);
  },
  componentDidMount: function(){
    this.remove_saveFile = app.keypress(app.keypress.CTRL_S, this.saveFile);
    this.remove_closeDialog = app.keypress(app.keypress.ESC, this.hideOverlay);
  },
  componentWillUnmount: function(){
    if(this.remove_saveFile) {
     this.remove_saveFile();
    }; 
    if(this.remove_closeDialog) {
     this.remove_closeDialog();
    }; 
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
