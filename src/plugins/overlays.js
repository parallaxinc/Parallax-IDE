'use strict';

const React = require('react');

const HelpOverlay = require('../views/help-overlay');
const SaveOverlay = require('../views/save-overlay');
const ProjectOverlay = require('../views/project-overlay');
const DownloadOverlay = require('../views/download-overlay');
const DeleteFileOverlay = require('../views/delete-file-overlay');
const DeleteProjectOverlay = require('../views/delete-project-overlay');

const store = require('../store');

const {
  NO_OVERLAY,
  HELP_OVERLAY,
  SAVE_OVERLAY,
  DOWNLOAD_OVERLAY,
  PROJECTS_OVERLAY,
  DELETE_FILE_OVERLAY,
  DELETE_PROJECT_OVERLAY
} = require('../constants/overlay-states');

function overlays(app, opts, done){

  const { overlay, workspace, handlers } = app;

  function renderOverlay(component){
    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  }

  function onOverlayChange(){
    const { overlayState } = store.getState();

    switch(overlayState){
      case HELP_OVERLAY:
        renderOverlay(<HelpOverlay workspace={workspace} handlers={handlers} />);
        break;
      case SAVE_OVERLAY:
        renderOverlay(<SaveOverlay workspace={workspace} handlers={handlers} />);
        break;
      case DOWNLOAD_OVERLAY:
        renderOverlay(<DownloadOverlay store={store} handlers={handlers} />);
        break;
      case PROJECTS_OVERLAY:
        renderOverlay(<ProjectOverlay workspace={workspace} handlers={handlers} />);
        break;
      case DELETE_FILE_OVERLAY:
        renderOverlay(<DeleteFileOverlay workspace={workspace} handlers={handlers} />);
        break;
      case DELETE_PROJECT_OVERLAY:
        renderOverlay(<DeleteProjectOverlay store={store} handlers={handlers} />);
        break;
      case NO_OVERLAY:
        overlay.hide();
        break;
    }
  }

  store.subscribe(onOverlayChange);

  done();
}

module.exports = overlays;
