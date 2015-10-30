'use strict';

const React = require('react');

const history = require('../lib/history');
const store = require('../store');

const {
  NO_OVERLAY,
  HELP_OVERLAY,
  SAVE_OVERLAY,
  DOWNLOAD_OVERLAY,
  PROJECTS_OVERLAY,
  OVERWRITE_OVERLAY,
  NEW_VERSION_OVERLAY,
  DELETE_FILE_OVERLAY,
  SAVE_ON_CHANGE_OVERLAY,
  DELETE_PROJECT_OVERLAY
} = require('../constants/overlay-states');

function overlays(app, opts, done){

  const { workspace, handlers } = app;

  function onOverlayChange(){
    const { overlayState } = store.getState();

    switch(overlayState){
      case HELP_OVERLAY:
        history.pushState({}, '/overlay/help');
        break;
      case SAVE_OVERLAY:
        history.pushState({}, '/overlay/save');
        break;
      case SAVE_ON_CHANGE_OVERLAY:
        history.pushState({}, '/overlay/save?showDontSaveButton=true');
        break;
      case OVERWRITE_OVERLAY:
        history.pushState({}, '/overlay/overwrite');
        break;
      case NEW_VERSION_OVERLAY:
        history.pushState({}, '/overlay/newversion');
        break;
      case DOWNLOAD_OVERLAY:
        history.pushState({}, '/overlay/help');
        break;
      case PROJECTS_OVERLAY:
        history.pushState({}, '/overlay/project');
        break;
      case DELETE_FILE_OVERLAY:
        history.pushState({}, '/overlay/deletefile');
        break;
      case DELETE_PROJECT_OVERLAY:
        history.pushState({}, '/overlay/deleteproject');
        break;
      case NO_OVERLAY:
        history.pushState({}, '/');
        break;
    }
  }

  store.subscribe(onOverlayChange);

  done();
}

module.exports = overlays;
