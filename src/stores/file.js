'use strict';

const _ = require('lodash');
var CodeMirror = require('codemirror');

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
      initialLoad: true,
      isNewFile: false,
      showSaveOverlay: false,
      allowUpdate: 0
    };

    this.buffers = {};
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

    this._docSwap(builtName, true);

    this.setState({
      fileName: builtName,
      isNewFile: true
    });
  }

  _queueLoad(filename){
    this.loadQueue.push(filename);
  }

  _openBuffer(name, text, mode) {
    this.buffers[name] = CodeMirror.Doc(text, mode);
  }

  _selectBuffer(editor, name) {
    const buf = this.buffers[name];
    if(editor) {
      editor.swapDoc(buf);
    }
  }

  _docSwap(filename, overwrite) {

    const { cm } = this.getInstance();
    const mode = 'pbasic';
    let fresh = false;

    if(!this.buffers.hasOwnProperty(filename) || overwrite) {
      this._openBuffer(filename, '', mode);
      fresh = true;
    }

    this._selectBuffer(cm, filename);
    return fresh;
  }

  onLoadFile(filename){
    if(!filename){
      return;
    }

    const { workspace, userConfig } = this.getInstance();
    let { cm } = this.getInstance();
    const { isNewFile } = this.state;

    const content = workspace.current.deref();

    if(isNewFile && content.length){
      this._queueLoad(filename);
      this.onProcessSave();
      return;
    }
    else if(isNewFile && !content.length) {
      cm.getDoc().clearHistory();
    }

    this.setState({ allowUpdate: 1 });
    let fresh = this._docSwap(filename);

    workspace.loadFile(filename, (err) => {
      if(err){
        this._handleError(err);
        return;
      }

      cm = this.getInstance().cm;
      userConfig.set('last-file', filename);

      if(fresh && cm) {
        const doc = cm.getDoc();
        doc.clearHistory();
      }

      if(this.state.initialLoad) {
        const currentDoc = cm.getDoc();
        this.buffers[filename] = currentDoc;
        this.setState({ initialLoad: false });
      }


      this.setState({
        fileName: filename,
        isNewFile: false,
        allowUpdate: 0
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
