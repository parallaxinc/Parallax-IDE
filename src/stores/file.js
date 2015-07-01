'use strict';

const _ = require('lodash');

const alt = require('../alt');
const styles = require('../../plugins/sidebar/styles');

const { clearName, deleteFile, hideOverlay, loadFile, newFile,
  processCreate, processNoCreate, processSave, processSaveAs,
  updateName } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onDeleteFile: deleteFile,
      onHideOverlay: hideOverlay,
      onNewFile: newFile,
      onLoadFile: loadFile,
      onProcessCreate: processCreate,
      onProcessNoCreate: processNoCreate,
      onProcessSave: processSave,
      onProcessSaveAs: processSaveAs,
      onUpdateName: updateName
    });

    this.state = {
      fileName: '',
      isNewFile: false,
      showSaveOverlay: false
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
      .tap(() => this._handleSuccess(`'${name}' deleted successfully`))
      .catch(this._handleError)
      .finally(() => {
        this.setState({ showSaveOverlay: false });
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
      .tap(() => this._handleSuccess(`'${name}' created successfully`))
      .catch(this._handleError)
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
      .tap(() => this._handleSuccess(`'${name}' saved successfully`))
      .catch(this._handleError);
  }

  onNewFile() {
    const { workspace, userConfig, documents } = this.getInstance();

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

    documents.create(builtName, '');

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

    const content = workspace.current.deref();

    if(isNewFile && content.length){
      this._queueLoad(filename);
      this.onProcessSave();
      return;
    }

    const doc = documents.swap(filename);
    if(doc){
      this.state.fileName = filename;
      workspace.current.update(() => doc.getValue());
      workspace.filename.update(() => filename);
      documents.focus();
      return;
    }

    workspace.loadFile(filename, (err) => {
      if(err){
        this._handleError(err);
        return;
      }

      userConfig.set('last-file', filename);

      documents.create(filename, workspace.current.deref());
      documents.focus();

      this.setState({
        fileName: filename,
        isNewFile: false
      });
    });
  }

  _handleError(err){
    // leaving this in for better debugging of errors
    console.log(err);
    const { toast } = this.getInstance();

    toast.show(err.message, { style: styles.errorToast });
  }

  _handleSuccess(msg){
    const { toast } = this.getInstance();

    toast.show(msg, { style: styles.successToast, timeout: 5000 });
  }


}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
