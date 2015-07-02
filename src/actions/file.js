'use strict';

const alt = require('../alt');

class FileActions {
  clearName() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }

  deleteFile(name) {
    this.dispatch(name);
  }

  newFile() {
    this.dispatch();
  }

  loadFile(filename){
    this.dispatch(filename);
  }

  saveFile() {
    this.dispatch();
  }

  saveFileAs(name) {
    this.dispatch(name);
  }

  handleError(err) {
    this.dispatch(err);
  }

  handleSuccess(msg) {
    this.dispatch(msg);
  }
}

module.exports = alt.createActions(FileActions);
