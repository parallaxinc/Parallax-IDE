'use strict';

const React = require('react');

const SaveOverlay = require('../sidebar/overlays/save');
const DownloadOverlay = require('../sidebar/overlays/download');
const DeleteConfirmOverlay = require('../sidebar/overlays/delete-confirm');

const overlayStore = require('../../src/stores/overlay');

const { handleError, handleSuccess, deleteFile, saveFile } = require('../../src/actions/file');
const { hideSave, hideDelete, hideDownload } = require('../../src/actions/overlay');

function overlays(app, opts, done){

  const { overlay, workspace } = app;

  function renderOverlay(component){
    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  }

  function onOverlayChange(){
    const { showSaveOverlay, showDeleteOverlay, showDownloadOverlay } = overlayStore.getState();

    console.log(overlayStore.getState());
    let component;
    if(showSaveOverlay){
      component = (
        <SaveOverlay
          onAccept={saveFile}
          onCancel={hideSave} />
      );
    }

    if(showDeleteOverlay){
      const name = workspace.filename.deref();
      if(name){
        component = (
          <DeleteConfirmOverlay
            name={name}
            onAccept={deleteFile}
            onCancel={hideDelete} />
        );
      }
    }

    if(showDownloadOverlay){
      component = (
        <DownloadOverlay
          onCancel={hideDownload}
          handleSuccess={handleSuccess}
          handleError={handleError} />
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
