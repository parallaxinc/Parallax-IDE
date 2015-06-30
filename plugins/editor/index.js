'use strict';

require('codemirror/mode/javascript/javascript');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/dialog/dialog.css');
require('codemirror/addon/search/search');
require('codemirror/addon/selection/mark-selection');
require('codemirror/lib/codemirror.css');
require('../../assets/theme/parallax.css');

var CodeMirror = require('codemirror');
require('./pbasic')(CodeMirror);

var keyExtension = require('./key-extension');
const consoleStore = require('../../src/stores/console');
var editorStore = require('../../src/stores/editor');
var fileStore = require('../../src/stores/file');
var { handleInput } = require('../../src/actions/editor');

const React = require('react');
const TransmissionBar = require('./transmission-bar');

function editor(app, opts, done){

  var codeEditor;
  var outputConsole;
  var transmission;

  function refreshConsole(){
    const { text } = consoleStore.getState();

    if(outputConsole){
      outputConsole.innerHTML = text;
      outputConsole.scrollTop = outputConsole.scrollHeight;
    }
  }

  consoleStore.listen(refreshConsole);

  var space = app.workspace;

  app.view('editor', function(el, cb){
    console.log('editor render');

    if(!codeEditor){
      let editorContainer = document.createElement('div');
      editorContainer.style.display = 'flex';
      editorContainer.style.flex = '1';
      editorContainer.style.flexDirection = 'column';
      editorContainer.setAttribute('id', 'editorContainer');
      el.appendChild(editorContainer);

      codeEditor = CodeMirror(editorContainer, {
        value: space.current.deref(),
        mode: 'pbasic',
        theme: 'parallax',
        lineNumbers: true
      });

      codeEditor.on('inputRead', handleInput);
      codeEditor.on('keyHandled', handleInput);

      codeEditor.setOption('styleSelectedText', true);
      codeEditor.setOption('tabSize', 2);
      codeEditor.setOption('extraKeys', {
        'Ctrl-Up': false,
        'Ctrl-Down': false,
        'Tab': false,
        'Shift-Tab': false
      });
      keyExtension.setup(app);
      editorStore.cm = codeEditor;
      fileStore.cm = codeEditor;
    }

    if(!outputConsole){
      outputConsole = document.createElement('pre');
      outputConsole.style.height = '200px';
      outputConsole.style.boxShadow = 'inset 0 5px 10px -5px rgba(0, 0, 0, 0.26)';
      outputConsole.style.backgroundColor = 'white';
      outputConsole.style.padding = '10px';
      outputConsole.style.margin = '0';
      outputConsole.style.overflow = 'auto';
      outputConsole.style.whiteSpace = 'pre-wrap';
      el.appendChild(outputConsole);
    }
    if(!transmission) {
      transmission = document.createElement('div');
      el.appendChild(transmission);
      React.render(<TransmissionBar />, transmission);
    }

    cb();
  });

  space.updateContent(opts.initial, done);
}

module.exports = editor;
