'use strict';

const React = require('react');

const SaveOverlay = require('../../src/views/save-overlay');
const ProjectOverlay = require('../../src/views/project-overlay');
const DownloadOverlay = require('../../src/views/download-overlay');
const DeleteConfirmOverlay = require('../../src/views/delete-confirm-overlay');

const deviceStore = require('../../src/stores/device');
const overlayStore = require('../../src/stores/overlay');
const projectStore = require('../../src/stores/project');

const { deleteProject } = require('../../src/actions/project');
const { showProjects } = require('../../src/actions/overlay');

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
