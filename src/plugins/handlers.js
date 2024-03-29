'use strict';

const path = require('path');

const _ = require('lodash');
const when = require('when');

const cm = require('../code-mirror');
const store = require('../store');
const creators = require('../creators');
const consoleStore = require('../console-store');

const Terminal = require('../lib/terminal');
const Documents = require('../lib/documents');
const highlighter = require('../lib/highlighter');
const directive = require('../lib/directive');
const history = require('../lib/history');

const {
  NEW_FILE,
  CHANGE_FILE,
  OVERWRITE_FILE
} = require('../constants/queued-action-types');

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

  function handleActionQueue(){
    const { nextAction, nextFile } = store.getState();

    store.dispatch(creators.resetActionQueue());

    switch(nextAction){
      case NEW_FILE:
        return newFile();
      case CHANGE_FILE:
        return changeFile(nextFile);
      case OVERWRITE_FILE:
        return saveFileAs(nextFile, true);
    }
  }

  function newFile(){
    const { cwd, directory, isNew, content } = workspace.getState();

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

    // TODO: DRY this up
    if(isNew && _.trim(content).length){
      store.dispatch(creators.queueNewFile());
      showSaveOnChangeOverlay();
      return;
    }

    const insertDirective = directive('BS2', 2.5);

    workspace.newFile(builtName, insertDirective)
      .then(() => userConfig.set('last-file', builtName))
      .then(function(){
        documents.create(path.join(cwd, builtName), insertDirective);
        documents.focus();
        goDocEnd();
      });
  }

  function saveFile(){
    const { filename, content, isNew, cwd } = workspace.getState();

    if(isNew){
      showSaveOverlay();
    } else {
      workspace.saveFile(filename, content)
        .then(function(){
          documents.swap(path.join(cwd, filename));
        });
      hideOverlay();
    }
  }

  function saveFileAs(filename, overwrite){
    if(!filename){
      return;
    }

    const { cwd, content, directory } = workspace.getState();
    if(!overwrite && _.filter(directory, {name: filename}).length){
      return showOverwriteOverlay(filename);
    }

    workspace.updateFilename(filename)
      .then(() => workspace.saveFile(filename, content))
      .then(() => userConfig.set('last-file', filename))
      .then(function(){
        documents.replace(path.join(cwd, filename));
        handleActionQueue();
      });
    hideOverlay();
  }

  function overwriteFile(){
    handleActionQueue();
  }

  function ensureExampleProject(examples, dirname){
    return workspace.changeDirectory(dirname)
      .then(function(){
        const { directory } = workspace.getState();
        const missing = _.reduce(examples, (result, content, name) => {
          const baseName = path.basename(name, '.bs2');
          if(!_.some(directory, 'name', baseName)){
            result[baseName] = content;
          }
          return result;
        }, {});
        if(_.size(missing) > 0){
          return when.settle(_.map(missing, (content, name) => workspace.saveFile(name, content)));
        }
      });
  }

  function cancelOverwriteFile(){
    const { nextFile } = store.getState();
    store.dispatch(creators.queueChangeFile(nextFile));
    history.goBack();
  }

  function dontSaveFile(){
    const { nextFile } = store.getState();

    // TODO: handle error
    workspace.resetFile()
      .then(handleActionQueue);
  }

  function deleteFile(filename){
    if(!filename){
      return;
    }

    const { cwd } = workspace.getState();

    // TODO: switch userConfig last-file
    workspace.deleteFile(filename)
      .then(function(){
        documents.remove(path.join(cwd, filename));
      })
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

    // TODO: DRY this up
    if(isNew && _.trim(content).length){
      store.dispatch(creators.queueChangeFile(filename));
      showSaveOnChangeOverlay();
      return;
    }

    const doc = documents.swap(path.join(cwd, filename));
    if(doc){
      workspace.changeFile(filename)
        .then(() => userConfig.set('last-file', filename))
        .then(() => workspace.updateContent(doc.getValue()))
        .then(function(){
          documents.focus();
        });
      return;
    }

    // TODO: handle error
    workspace.changeFile(filename)
      .then(() => userConfig.set('last-file', filename))
      .then(() => {
        const { content } = workspace.getState();
        documents.create(path.join(cwd, filename), content);
        documents.focus();
      });
  }

  function changeProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    return workspace.changeDirectory(dirpath)
      .then(() => userConfig.set('cwd', dirpath))
      .then(() => userConfig.unset('last-file'));
  }

  function deleteProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.deleteDirectory(dirpath)
      .finally(function(){
        showProjectsOverlay();
      });
  }

  function deleteProjectConfirm(name){
    store.dispatch(creators.deleteProjectConfirm(name));
    history.pushState({}, '/overlay/deleteproject');
  }

  function showHelpOverlay(){
    history.pushState({}, '/overlay/help');
  }

  function showSaveOverlay(){
    history.pushState({}, '/overlay/save');
  }

  function showSaveOnChangeOverlay(){
    history.pushState({}, '/overlay/save?showDontSaveButton=true');
  }

  function showOverwriteOverlay(name){
    store.dispatch(creators.queueOverwriteFile(name));
    history.pushState({}, '/overlay/overwrite');
  }

  function showDownloadOverlay(){
    history.pushState({}, '/overlay/download');
    // TODO: is there ever a time when show download overlay doesn't reload devices?
    /* eslint no-use-before-define: false */
    reloadDevices();
  }

  function showProjectsOverlay(){
    history.pushState({}, '/overlay/project');
  }

  function showDeleteFileOverlay(){
    history.pushState({}, '/overlay/deletefile');
  }

  function showNewVersionOverlay(){
    chrome.storage.local.get('newVersion', function(val) {
      if(val.newVersion){
        chrome.storage.local.remove('newVersion', function() {
          history.pushState({}, '/overlay/newversion');
        });
      }
    });
  }

  function hideOverlay(){
    history.pushState({}, '/');
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

  function goDocEnd(){
    cm.execCommand('goDocEnd');
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

  function compile(){
    const { content } = workspace.getState();
    // TODO: it is a pain that compile requires `this`
    const result = app.compile({
      type: 'bs2',
      source: content
    });

    return result.error;
  }

  function handleError(err){
    if(err){
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

  function syntaxCheck(){
    const err = compile();
    handleError(err);
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

  function rxClearTimeout(){
    consoleStore.dispatch(creators.rxClearTimeout());
  }

  function rxOff(){
    const { rxtx } = consoleStore.getState();
    const { offDuration } = rxtx;
    consoleStore.dispatch(creators.rxOff());
    setTimeout(rxClearTimeout, offDuration);
  }

  function rxOn(){
    const { rxtx } = consoleStore.getState();
    const { duration, rxTimeout } = rxtx;

    let timeout;
    if(!rxTimeout){
      timeout = setTimeout(rxOff, duration);
      consoleStore.dispatch(creators.rxOn(timeout));
    }

  }

  function txClearTimeout(){
    consoleStore.dispatch(creators.txClearTimeout());
  }

  function txOff(){
    const { rxtx } = consoleStore.getState();
    const { offDuration } = rxtx;
    consoleStore.dispatch(creators.txOff());
    setTimeout(txClearTimeout, offDuration);
  }

  function txOn(){
    const { rxtx } = consoleStore.getState();
    const { duration, txTimeout } = rxtx;

    let timeout;
    if(!txTimeout){
      timeout = setTimeout(txOff, duration);
      consoleStore.dispatch(creators.txOn(timeout));
    }

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
      const offset = terminal.getOffset();
      store.dispatch(creators.receive(output, offset));
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

  function onTransmit(){
    txOn();
  }

  function toggleEcho(){
    const { device } = store.getState();
    const { echo } = consoleStore.getState();
    const { selected, connected } = device;
    if(echo){
      consoleStore.dispatch(creators.echoOff());
    }else{
      consoleStore.dispatch(creators.echoOn());
    }
    if(selected && connected){
      const board = app.getBoard(selected);
      board.setEcho(!echo);
    }
  }

  function download() {
    const { device } = store.getState();
    const { selected } = device;
    const { filename, content } = workspace.getState();
    const { echo } = consoleStore.getState();

    if(!selected){
      return;
    }

    const board = app.getBoard(selected);

    // safety remove attempt for progress
    board.removeListener('transmit', onTransmit);
    board.removeListener('progress', onProgress);
    board.removeListener('terminal', onTerminal);
    board.removeListener('close', onClose);

    board.on('progress', onProgress);

    board.bootload(content)
      .then(function(){
        clearTerminal();
        board.on('terminal', onTerminal);
        board.on('close', onClose);
        board.on('transmit', onTransmit);
        toast.clear();

        toast.show(`'${filename}' downloaded successfully`, successToastOpts);
      })
      .catch(handleError)
      .finally(function(){
        board.removeListener('progress', onProgress);
        resetDownloadProgress();
        connect();
        board.setEcho(echo);
        hideOverlay();
      });
  }

  function checkAutoDownload(){
    const { deviceList } = store.getState();
    const { none, noneMatched, multiple } = messages;

    const typeMatches = _.filter(deviceList, ({ name, type }) => name && (type === 'bs2'));
    const exactMatches = _.filter(deviceList, ({ match, name }) => match && name);

    if(exactMatches.length === 1){
      store.dispatch(creators.clearSearchStatus());
      store.dispatch(creators.updateSelectedDevice(exactMatches[0]));
      download();
      return;
    }

    if(exactMatches.length > 1){
      store.dispatch(creators.updateSearchStatus(multiple));
      return;
    }

    if(typeMatches.length > 0 && exactMatches.length === 0){
      store.dispatch(creators.updateSearchStatus(noneMatched));
      return;
    }

    store.dispatch(creators.updateSearchStatus(none));
  }

  function reloadDevices(){
    const { device } = store.getState();
    const { autoDownload } = device;
    const { content } = workspace.getState();

    if(autoDownload){
      const err = compile();

      if(err){
        handleError(err);
        hideOverlay();
        return;
      }
    }

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ],
      source: content,
      delay: 500
    };

    store.dispatch(creators.reloadDevices());

    app.scanBoards(scanOpts)
      .then(function(devices){
        store.dispatch(creators.updateDevices(devices));

        if(autoDownload){
          // windows serial sometimes needs to wait after boards scanned.
          setTimeout(function() {
            checkAutoDownload();
          }, 300);
        }
      });
  }

  function selectDevice(device) {
    const { content } = workspace.getState();

    // need to make sure we have all the information before rewriting the source
    if(!device.match && device.name && device.program) {
      const { name } = device;
      // TODO: handle unnamed device
      const { TargetStart } = device.program.raw;
      const end = content.indexOf('}', TargetStart);

      const pre = content.substring(0, TargetStart);
      const post = content.substring(end, content.length);
      const newSource = pre + name + post;

      workspace.updateContent(newSource)
        .then(function(){
          documents.update(newSource);
          store.dispatch(creators.updateSelectedDevice(device));
          download();
        });
      // workspace.updateContent is a promise returning function
      // so we handle the other stuff in a .then and return here
      return;
    }

    store.dispatch(creators.updateSelectedDevice(device));

    download();
  }

  function deviceAdded(){
    const { device } = store.getState();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ],
      delay: 500
    };

    app.scanBoards(scanOpts)
      .then(function(devices){
        store.dispatch(creators.updateDevices(devices));
        if(device.selected && device.path && !device.connected && _.some(devices, 'path', device.selected.path)){
          var board = app.getBoard(device.selected);
          if(board){
            board.removeListener('terminal', onTerminal);
            board.removeListener('close', onClose);
            board.open()
              .then(function(){
                connect();
                board.on('terminal', onTerminal);
                board.on('close', onClose);
              });
          }
        }
      });
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
    overwriteFile,
    cancelOverwriteFile,
    // project methods
    changeProject,
    deleteProject,
    deleteProjectConfirm,
    ensureExampleProject,
    // overlay methods
    showHelpOverlay,
    showSaveOverlay,
    showSaveOnChangeOverlay,
    showNewVersionOverlay,
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
    toggleEcho,
    enableAutoDownload,
    disableAutoDownload,
    deviceAdded
  });

  done();
}

module.exports = handlers;
