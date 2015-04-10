'use strict';

require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/neo.css');

var CodeMirror = require('codemirror');

function editor(app, opts, done){

  var codeEditor;
  var outputConsole;

  var space = app.workspace;

  function output(text){
    if(outputConsole){
      outputConsole.innerHTML += text;
      outputConsole.scrollTop = outputConsole.scrollHeight;
    }
  }

  function clearOutput(){
    if(outputConsole){
      outputConsole.innerHTML = '';
    }
  }

  output.clear = clearOutput;

  app.expose('logger', output);

  app.view('editor', function(el, cb){
    console.log('editor render');

    if(!codeEditor){
      let editorContainer = document.createElement('div');
      editorContainer.style.display = 'flex';
      editorContainer.style.flex = '1';
      editorContainer.style.flexDirection = 'column';
      el.appendChild(editorContainer);

      codeEditor = CodeMirror(editorContainer, {
        value: space.current.deref(),
        mode: 'javascript',
        theme: 'neo',
        lineNumbers: true
      });

      codeEditor.on('inputRead', handleInput);
      codeEditor.on('keyHandled', handleInput);

      space._structure.on('swap', function(){
        var editorCursor = codeEditor.getCursor();
        var current = space.current.deref();
        if(current !== codeEditor.getValue()){
          codeEditor.setValue(current);
          codeEditor.setCursor(editorCursor);
        }
      });
    }

    if(!outputConsole){
      outputConsole = document.createElement('pre');
      outputConsole.style.height = '200px';
      outputConsole.style.boxShadow = 'inset 0 5px 10px -5px rgba(0, 0, 0, 0.26)';
      outputConsole.style.backgroundColor = 'white';
      outputConsole.style.padding = '10px';
      outputConsole.style.overflow = 'auto';
      outputConsole.style.whiteSpace = 'pre-wrap';
      el.appendChild(outputConsole);
    }

    cb();
  });

  function handleInput(inst){
    space.updateContent(inst.getValue());
  }

  space.updateContent(opts.initial, done);
}

module.exports = editor;
