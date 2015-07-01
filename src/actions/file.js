'use strict';

const alt = require('../alt');

class FileActions {
  clearName() {
    this.dispatch();
  }

  deleteFile(name) {
    this.dispatch(name);
  }

  hideOverlay() {
    this.dispatch();
  }

  handleError(err) {
    this.dispatch(err);
  }

  handleSuccess(msg) {
    this.dispatch(msg);
  }

  newFile() {
    this.dispatch();
  }

  noDelete() {
    this.dispatch();
  }

  loadFile(filename){
    this.dispatch(filename);
  }

  processCreate(name) {
    this.dispatch(name);
  }

  processNoCreate(status){
    this.dispatch(status);
  }

  processSave() {
    this.dispatch();
  }

  processSaveAs() {
    this.dispatch();
  }

  showDelete() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }

}

module.exports = alt.createActions(FileActions);
