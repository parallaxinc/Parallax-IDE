'use strict';

const path = require('path');

const _ = require('lodash');

const cm = require('../code-mirror');
const store = require('../store');
const creators = require('../creators');
const consoleStore = require('../console-store');

const Terminal = require('../lib/terminal');
const Documents = require('../lib/documents');
const highlighter = require('../lib/highlighter');

// TODO: move somewhere else?
const red = '#da2100';
const green = '#159600';

const styles = {
  errorToast: {
    backgroundColor: red
  },
  successToast: {
    backgroundColor: green
  }
};

const errorToastOpts = {
  style: styles.errorToast
};

const successToastOpts = {
  style: styles.successToast,
  timeout: 5000
};

// TODO: move somewhere
const messages = {
  none: 'No BASIC Stamps found.',
  noneMatched: 'No matching BASIC Stamps found.',
  multiple: 'Please select which module to download to.'
};

const terminal = new Terminal();

// TODO: refactor this plugin into smaller modules
function handlers(app, opts, done){

  // TODO: define outside of plugin?
  const documents = new Documents(cm);

  const {
    toast,
    workspace,
    userConfig
  } = app;

  function newFile(){
    const { cwd, directory } = workspace.getState();

    // TODO: utility function
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

    workspace.newFile(builtName, '');

    userConfig.set('last-file', builtName);

    documents.create(path.join(cwd, builtName), '');
    documents.focus();
  }

  function saveFile(){
    const { filename, content, isNew } = workspace.getState();

    if(isNew){
      showSaveOverlay();
    } else {
      workspace.saveFile(filename, content);
    }
  }

  function saveFileAs(filename){
    if(!filename){
      return;
    }

    const { nextFile } = store.getState();
    const { content } = workspace.getState();

    workspace.updateFilename(filename)
      .then(function(){
        return workspace.saveFile(filename, content);
      })
      .then(function(){
        if(nextFile){
          changeFile(nextFile);
        }
      });
  }

  function dontSaveFile(){
    const { nextFile } = store.getState();

    workspace.resetFile()
      .then(function(){
        if(nextFile){
          changeFile(nextFile);
        }
      });
  }

  function deleteFile(filename){
    if(!filename){
      return;
    }

    // TODO: switch userConfig last-file
    workspace.deleteFile(filename)
      .then(newFile);
  }

  function changeFile(filename){
    if(!filename){
      return;
    }

    const {
      isNew,
      content,
      cwd
    } = workspace.getState();

    store.dispatch(creators.resetFileQueue());

    if(isNew && content.length){
      store.dispatch(creators.queueFileChange(filename));
      showSaveOverlay();
      return;
    }

    const doc = documents.swap(path.join(cwd, filename));
    if(doc){
      workspace.updateFilename(filename);
      workspace.updateContent(doc.getValue());
      documents.focus();
      return;
    }

    // TODO: handle error
    workspace.changeFile(filename)
      .then(() => {
        const { content } = workspace.getState();
        userConfig.set('last-file', filename);

        documents.create(path.join(cwd, filename), content);
        documents.focus();
      });
  }

  // TODO: should return a promise
  function changeProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    return workspace.changeDirectory(dirpath)
      .then(() => {
        userConfig.set('cwd', dirpath);
        userConfig.set('last-file', '');
      });
  }

  function deleteProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.deleteDirectory(dirpath);
  }

  function deleteProjectConfirm(name){
    store.dispatch(creators.deleteProjectConfirm(name));
    store.dispatch(creators.showDeleteProjectOverlay());
  }

  function showSaveOverlay(){
    store.dispatch(creators.showSaveOverlay());
  }

  function showDownloadOverlay(){
    store.dispatch(creators.showDownloadOverlay());
    // TODO: is there ever a time when show download overlay doesn't reload devices?
    /* eslint no-use-before-define: false */
    reloadDevices();
  }

  function showProjectsOverlay(){
    store.dispatch(creators.showProjectsOverlay());
  }

  function showDeleteFileOverlay(){
    store.dispatch(creators.showDeleteFileOverlay());
  }

  function hideOverlay(){
    store.dispatch(creators.hideOverlay());
  }

  function findNext(){
    cm.execCommand('findNext');
  }

  function findPrevious(){
    cm.execCommand('findPrev');
  }

  function replace(){
    cm.execCommand('replace');
  }

  function moveByScrollUpLine(){
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  }

  function moveByScrollDownLine(){
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }

  function indent(){
    cm.execCommand('indentMore');
  }

  function dedent(){
    cm.execCommand('indentLess');
  }

  function print(){
    const { filename } = workspace.getState();

    const { title } = document;
    document.title = filename;
    cm.setOption('viewportMargin', Infinity);
    window.print();
    document.title = title;
    cm.setOption('viewportMargin', 10);
  }

  function handleInput(){
    workspace.updateContent(cm.getValue());
  }

  function syntaxCheck() {
    const { content } = workspace.getState();
    // TODO: it is a pain that compile requires `this`
    const result = app.compile({
      type: 'bs2',
      source: content
    });
    if(result.error){
      const err = result.error;
      // leaving this in for better debugging of errors
      console.log(err);

      toast.show(err.message, errorToastOpts);

      if(err && err.errorLength){
        highlighter(err.errorPosition, err.errorLength);
      }
    } else {
      toast.clear();
      toast.show('Tokenization successful!', successToastOpts);
    }
  }

  function transmitInput(value){
    const { device } = store.getState();
    const { selected } = device;

    const board = app.getBoard(selected);

    // TODO: move out of closure
    board.once('transmit', function(evt){
      const { transmission } = store.getState();
      const { input } = transmission;

      const newText = _.reduce(evt, (result, ch) => {
        if(ch.type === 'backspace'){
          return result.slice(0, -1);
        }

        if(ch.type === 'text'){
          return result + ch.data;
        }

        return result;
      }, input);

      store.dispatch(creators.transmit(newText));
    });

    // TODO: handle error
    board.write(value);
      // .catch((err) => this._handleError(err));
  }

  function rxOff(){
    consoleStore.dispatch(creators.rxOff());
  }

  function rxOn(){
    const { rxtx } = consoleStore.getState();
    const { duration, rxTimeout } = rxtx;

    let timeout;
    if(!rxTimeout){
      timeout = setTimeout(rxOff, duration);
    }

    consoleStore.dispatch(creators.rxOn(timeout));
  }

  function txOff(){
    consoleStore.dispatch(creators.txOff());
  }

  function txOn(){
    const { rxtx } = consoleStore.getState();
    const { duration, txTimeout } = rxtx;

    let timeout;
    if(!txTimeout){
      timeout = setTimeout(txOff, duration);
    }

    consoleStore.dispatch(creators.txOn(timeout));
  }

  function updateDuration(duration){
    consoleStore.dispatch(creators.updateDuration(duration));
  }

  function connect(){
    store.dispatch(creators.connect());
  }

  function disconnect(){
    store.dispatch(creators.disconnect());
  }

  function updateTerminal(msg){
    terminal.refreshBuffer(msg, function(){
      const output = terminal.getLines();
      store.dispatch(creators.receive(output));
    });
  }

  function clearTerminal(){
    terminal.clearAll();
    store.dispatch(creators.clearTransmission());
  }

  function updateDownloadProgress(progress){
    store.dispatch(creators.updateDownloadProgress(progress));
  }

  function resetDownloadProgress(){
    store.dispatch(creators.resetDownloadProgress());
  }

  function onTerminal(msg){
    updateTerminal(msg);
    rxOn();
  }

  function onClose(){
    disconnect();
  }

  function onProgress(progress){
    updateDownloadProgress(progress);
    txOn();
  }

  function download() {
    const { device } = store.getState();
    const { selected } = device;
    const { filename, content } = workspace.getState();

    if(!selected){
      return;
    }

    const board = app.getBoard(selected);

    // safety remove attempt for progress
    board.removeListener('progress', onProgress);
    board.removeListener('terminal', onTerminal);
    board.removeListener('close', onClose);

    board.on('progress', onProgress);

    board.bootload(content)
      .then(function(){
        clearTerminal();
        board.on('terminal', onTerminal);
        board.on('close', onClose);
        toast.clear();

        toast.show(`'${filename}' downloaded successfully`, successToastOpts);
      })
      .catch(function(err){
        // TODO: this is used twice, should be a util or something
        // leaving this in for better debugging of errors
        console.log(err);
        toast.show(err.message, errorToastOpts);

        if(err && err.errorLength){
          highlighter(err.errorPosition, err.errorLength);
        }
      })
      .finally(function(){
        board.removeListener('progress', onProgress);
        resetDownloadProgress();
        connect();
        hideOverlay();
      });
  }

  function checkAutoDownload(){
    const { deviceList } = store.getState();
    const { none, noneMatched, multiple } = messages;

    const hasMatch = _.some(deviceList, { match: true });
    const matchedDevices = _.filter(deviceList, ({ match, name }) => match && name);

    if (!hasMatch) {
      store.dispatch(creators.updateSearchStatus(none));
    } else if (matchedDevices.length === 0) {
      store.dispatch(creators.updateSearchStatus(noneMatched));
    } else if(matchedDevices.length === 1) {
      store.dispatch(creators.clearSearchStatus());
      store.dispatch(creators.updateSelectedDevice(matchedDevices[0]));
      download();
    } else {
      store.dispatch(creators.updateSearchStatus(multiple));
    }
  }

  function reloadDevices(){
    const { device } = store.getState();
    const { autoDownload } = device;
    const { content } = workspace.getState();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ],
      source: content
    };

    store.dispatch(creators.reloadDevices());

    app.scanBoards(scanOpts)
      .then(function(devices){
        store.dispatch(creators.updateDevices(devices));

        if(autoDownload){
          // TODO: how can I clean up this interaction?
          checkAutoDownload();
        }
      });
  }

  function selectDevice(device) {
    const { content } = workspace.getState();

    if(!device.match) {
      const { name } = device;
      // TODO: handle unnamed device
      const { TargetStart } = device.program.raw;
      const end = content.indexOf('}', TargetStart);

      const pre = content.substring(0, TargetStart);
      const post = content.substring(end, content.length);
      const newSource = pre + name + post;

      documents.update(newSource);
      workspace.updateContent(newSource);
    }

    store.dispatch(creators.updateSelectedDevice(device));

    download();
  }

  function enableAutoDownload(){
    store.dispatch(creators.enableAutoDownload());
  }

  function disableAutoDownload(){
    store.dispatch(creators.disableAutoDownload());
  }

  app.expose('handlers', {
    // file methods
    newFile,
    saveFile,
    saveFileAs,
    deleteFile,
    changeFile,
    dontSaveFile,
    // project methods
    changeProject,
    deleteProject,
    deleteProjectConfirm,
    // overlay methods
    showSaveOverlay,
    showDownloadOverlay,
    showProjectsOverlay,
    showDeleteFileOverlay,
    hideOverlay,
    // editor methods
    findNext,
    findPrevious,
    replace,
    moveByScrollUpLine,
    moveByScrollDownLine,
    indent,
    dedent,
    print,
    handleInput,
    syntaxCheck,
    // terminal methods
    transmitInput,
    // rxtx methods
    rxOn,
    rxOff,
    txOn,
    txOff,
    updateDuration,
    // device methods
    connect,
    disconnect,
    reloadDevices,
    selectDevice,
    download,
    enableAutoDownload,
    disableAutoDownload
  });

  done();
}

module.exports = handlers;
