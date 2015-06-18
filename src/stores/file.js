'use strict';

const _ = require('lodash');

const alt = require('../alt');
const styles = require('../../plugins/sidebar/styles');

const { clearName, deleteFile, hideOverlay, newFile, processCreate,
  processSave, updateName } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onDeleteFile: deleteFile,
      onHideOverlay: hideOverlay,
      onNewFile: newFile,
      onProcessCreate: processCreate,
      onProcessSave: processSave,
      onUpdateName: updateName
    });

    this.state = {
      fileName: '',
      showSaveOverlay: false
    };

  }

  onClearName() {
    this.setState({
      fileName: ''
    });
  }

  onDeleteFile(name) {
    const { overlay, workspace } = this.getInstance();

    if(!name){
      return;
    }

    workspace.deleteFile(workspace.filename)
      .tap(() => this._handleSuccess(`'${name}' deleted successfully`))
      .catch(this._handleError)
      .finally(() => {
        overlay.hide();
        this.onNewFile();
      });

  }

  onHideSave() {
    this.setState({
      showSaveOverlay: false
    });
  }

  onHideOverlay() {
    const { overlay } = this.getInstance();
    overlay.hide();
    this.onClearName();
  }

  onProcessCreate(name) {
    const { loadFile, overlay, workspace } = this.getInstance();

    if(!name){
      return;
    }

    workspace.filename.update(() => name);
    // TODO: these should transparently accept cursors for all non-function params
    workspace.saveFile(workspace.filename.deref(), workspace.current)
      .tap(() => loadFile(name, () => this._handleSuccess(`'${name}' created successfully`)))
      .catch(this._handleError)
      .finally(overlay.hide);

    this.onHideSave();
  }

  onProcessSave() {

    const { workspace } = this.getInstance();

    // TODO: reuse with checkUnsaved in sidebar index
    const file = workspace.filename.deref();
    const unnamed = workspace.directory.every(function(x) {
      if(x.get('name') === file) {
        return false;
      }
      else {
        return true;
      }
    });
    if(unnamed) {
      this.setState({
        fileName: file,
        showSaveOverlay: true
      });
    }
    else {
      this.setState({ showSaveOverlay: false });
      this._save();
    }
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
    const { workspace, userConfig } = this.getInstance();

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
  }

  onUpdateName(value) {
    this.setState({
      fileName: value
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
