'use strict';

const path = require('path');

const _ = require('lodash');

const alt = require('../alt');
const styles = require('../../plugins/sidebar/styles');

const { hideOverlays, hideSave } = require('../actions/overlay');
const {
  clearName,
  updateName,
  newFile,
  loadFile,
  saveFile,
  saveFileAs,
  deleteFile,
  handleError,
  handleSuccess } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onDeleteFile: deleteFile,
      onHandleError: handleError,
      onHandleSuccess: handleSuccess,
      onHideOverlay: hideOverlays,
      onNewFile: newFile,
      onLoadFile: loadFile,
      onSaveFileAs: saveFileAs,
      onCancelSave: hideSave,
      onSaveFile: saveFile,
      onUpdateName: updateName
    });

    this.state = {
      fileName: '',
      isNewFile: false
    };

    this.loadQueue = [];
  }

  onClearName() {
    const { workspace } = this.getInstance();
    this.setState({
      fileName: workspace.filename.deref()
    });
  }

  onUpdateName(value) {
    this.setState({
      fileName: value
    });
  }

  onDeleteFile(name) {
    const { workspace } = this.getInstance();

    if(!name){
      return;
    }

    workspace.deleteFile(workspace.filename)
      .tap(() => this.onHandleSuccess(`'${name}' deleted successfully`))
      .catch(this.onHandleError)
      .finally(() => this.onNewFile());
  }

  onHideOverlay() {
    this.onClearName();
  }

  onSaveFileAs(name) {
    const { workspace } = this.getInstance();

    if(!name){
      return;
    }

    workspace.filename.update(() => name);
    // TODO: these should transparently accept cursors for all non-function params
    workspace.saveFile(workspace.filename.deref(), workspace.current)
      .tap(() => {
        this.setState({ isNewFile: false });
        if(this.loadQueue.length){
          this.onLoadFile(this.loadQueue.shift());
        }
      })
      .tap(() => this.onHandleSuccess(`'${name}' created successfully`))
      .catch(this.onHandleError);
  }

  onCancelSave(status){
    if(!status.trash){
      return;
    }

    this.setState({ isNewFile: false });
    if(this.loadQueue.length){
      this.onLoadFile(this.loadQueue.shift());
    }
  }

  onSaveFile() {
    const { isNewFile } = this.state;

    if(isNewFile) {
      return;
    }

    const { workspace } = this.getInstance();

    const name = workspace.filename.deref();

    // TODO: these should transparently accept cursors for all non-function params
    workspace.saveFile(name, workspace.current)
      .tap(() => this.onHandleSuccess(`'${name}' saved successfully`))
      .catch(this.onHandleError);
  }

  onNewFile() {
    const { workspace, userConfig, documents } = this.getInstance();

    const cwd = workspace.cwd.deref();
    const directory = workspace.directory.toJS();
    const untitledNums = _.reduce(directory, function(untitled, dirfile) {
      if(dirfile.name.match(/untitled/)) {
        const getnum = dirfile.name.match(/\d+/);
        if (getnum) {
          untitled.push(_.parseInt(getnum[0]));
        }
      }
      return untitled;
    }, [0]);

    const untitledLast = _.max(untitledNums);

    const builtName = `untitled${untitledLast + 1}`;

    workspace.filename.update(() => builtName);
    workspace.updateContent('');

    userConfig.set('last-file', builtName);

    documents.create(path.join(cwd, builtName), '');

    this.setState({
      fileName: builtName,
      isNewFile: true
    });
  }

  _queueLoad(filename){
    this.loadQueue.push(filename);
  }

  onLoadFile(filename){
    if(!filename){
      return;
    }

    const { workspace, userConfig, documents } = this.getInstance();
    const { isNewFile } = this.state;

    const cwd = workspace.cwd.deref();
    const content = workspace.current.deref();

    if(isNewFile && content.length){
      this._queueLoad(filename);
      return;
    }

    const doc = documents.swap(path.join(cwd, filename));
    if(doc){
      this.state.fileName = filename;
      workspace.current.update(() => doc.getValue());
      workspace.filename.update(() => filename);
      documents.focus();
      return;
    }

    workspace.loadFile(filename, (err) => {
      if(err){
        this.onHandleError(err);
        return;
      }

      userConfig.set('last-file', filename);

      documents.create(path.join(cwd, filename), workspace.current.deref());
      documents.focus();

      this.setState({
        fileName: filename,
        isNewFile: false
      });
    });
  }

  onHandleError(err){
    // leaving this in for better debugging of errors
    console.log(err);
    const { toast } = this.getInstance();

    toast.show(err.message, { style: styles.errorToast });
  }

  onHandleSuccess(msg){
    const { toast } = this.getInstance();

    toast.show(msg, { style: styles.successToast, timeout: 5000 });
  }
}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
