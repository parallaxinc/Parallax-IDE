'use strict';

const cm = require('../code-mirror');

function editor(app, opts, done){

  const { handleInput } = app.handlers;

  var codeEditor;

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
    }

    cb();
  });

  done();
}

module.exports = editor;
