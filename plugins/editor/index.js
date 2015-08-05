'use strict';

const keyExtension = require('./key-extension');

const cm = require('../../src/code-mirror');

const deviceStore = require('../../src/stores/device');

const makeToasts = require('../../src/lib/toasts');
const highlighter = require('../../src/lib/highlighter');

function editor(app, opts, done){

  const { handleInput } = app.handlers;

  var codeEditor;

  // TODO: get rid of all this
  const toasts = makeToasts(app.toast, highlighter);
  deviceStore.documents = app.documents;
  deviceStore.toasts = toasts;

  app.view('editor', function(el, cb){
    console.log('editor render');

    if(!codeEditor){
      let editorContainer = document.createElement('div');
      editorContainer.style.display = 'flex';
      editorContainer.style.flex = '1';
      editorContainer.style.flexDirection = 'column';
      editorContainer.setAttribute('id', 'editorContainer');
      el.appendChild(editorContainer);

      codeEditor = cm;
      editorContainer.appendChild(codeEditor.getWrapperElement());

      codeEditor.on('change', handleInput);

      codeEditor.setOption('styleSelectedText', true);
      codeEditor.setOption('tabSize', 2);
      codeEditor.setOption('extraKeys', {
        'Ctrl-Up': false,
        'Ctrl-Down': false,
        'Tab': false,
        'Shift-Tab': false,
        'Ctrl-T': false
      });

      keyExtension.setup(app);
    }

    cb();
  });

  done();
}

module.exports = editor;
