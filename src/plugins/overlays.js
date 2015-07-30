'use strict';

const React = require('react');

const SaveOverlay = require('../views/save-overlay');
const ProjectOverlay = require('../views/project-overlay');
const DownloadOverlay = require('../views/download-overlay');
const DeleteConfirmOverlay = require('../views/delete-confirm-overlay');

const deviceStore = require('../stores/device');
const overlayStore = require('../stores/overlay');
const projectStore = require('../stores/project');

const { deleteProject } = require('../actions/project');
const { showProjects } = require('../actions/overlay');

function overlays(app, opts, done){

  const { overlay, workspace, userConfig } = app;

  projectStore.config = userConfig;
  projectStore.workspace = workspace;

  function renderOverlay(component){
    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  }

  function onOverlayChange(){
    const {
      showSaveOverlay,
      showDeleteOverlay,
      showDownloadOverlay,
      showProjectsOverlay,
      showProjectDeleteOverlay } = overlayStore.getState();
    const { filename } = workspace.getState();

    let component;
    if(showSaveOverlay){
      component = (
        <SaveOverlay />
      );
    }

    if(showDeleteOverlay && filename){
      component = (
        <DeleteConfirmOverlay workspace={workspace} />
      );
    }

    if(showDownloadOverlay){
      component = (
        <DownloadOverlay deviceStore={deviceStore} />
      );
    }

    if(showProjectsOverlay){
      component = (
        <ProjectOverlay workspace={workspace} />
      );
    }

    if(showProjectDeleteOverlay){
      const { deleteProjectName } = projectStore.getState();
      component = (
        <DeleteConfirmOverlay
          name={deleteProjectName}
          onAccept={deleteProject}
          onCancel={showProjects} />
      );
    }

    if(component){
      renderOverlay(component);
    } else {
      // if there is a change and every state is false, hide overlay
      overlay.hide();
    }
  }

  overlayStore.listen(onOverlayChange);

  done();
}

module.exports = overlays;
