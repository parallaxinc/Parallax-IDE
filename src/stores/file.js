'use strict';

const path = require('path');

const _ = require('lodash');

const alt = require('../alt');
const styles = require('../../plugins/sidebar/styles');

const { clearName, deleteFile, hideOverlay, handleError, handleSuccess, loadFile,
  noDelete, newFile, processCreate, processNoCreate, processSave, processSaveAs, showDelete,
  updateName } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onDeleteFile: deleteFile,
      onHandleError: handleError,
      onHandleSuccess: handleSuccess,
      onHideOverlay: hideOverlay,
      onNoDelete: noDelete,
      onNewFile: newFile,
      onLoadFile: loadFile,
      onProcessCreate: processCreate,
      onProcessNoCreate: processNoCreate,
      onProcessSave: processSave,
      onProcessSaveAs: processSaveAs,
      onShowDelete: showDelete,
      onUpdateName: updateName
    });

    this.state = {
      fileName: '',
      isNewFile: false,
      showSaveOverlay: false,
      showDeleteOverlay: false
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
      .finally(() => {
        this.setState({ showSaveOverlay: false });
        this.setState({ showDeleteOverlay: false });
        this.onNewFile();
      });

  }

  onHideSave() {
    this.setState({
      showSaveOverlay: false
    });
  }

  onHideOverlay() {
    this.setState({ showSaveOverlay: false });
    this.setState({ showDeleteOverlay: false });
    this.onClearName();
  }

  onProcessCreate(name) {
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
      .catch(this.onHandleError)
      .finally(() => this.setState({ showSaveOverlay: false }));

    this.onHideSave();
  }

  onProcessNoCreate(status){
    if(status.trash){
      this.setState({ isNewFile: false, showSaveOverlay: false });
      if(this.loadQueue.length){
        this.onLoadFile(this.loadQueue.shift());
      }
    } else {
      this.setState({ showSaveOverlay: false });
    }
  }

  onProcessSave() {
    const { isNewFile } = this.state;

    if(isNewFile) {
      this.setState({ showSaveOverlay: true });
    } else {
      this.setState({ showSaveOverlay: false });
      this._save();
    }
  }

  onProcessSaveAs() {
    this.setState({ showSaveOverlay: true });
  }

  _save() {
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
      this.onProcessSave();
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

  onNoDelete() {
    this.setState({ showDeleteOverlay: false });
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

  onShowDelete() {
    this.setState({ showDeleteOverlay: true });
  }


}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
