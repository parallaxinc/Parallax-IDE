'use strict';

const React = require('react');

const keyExtension = require('./key-extension');

const cm = require('../../src/code-mirror');
const consoleStore = require('../../src/stores/console');
const editorStore = require('../../src/stores/editor');
const deviceStore = require('../../src/stores/device');

const { handleInput } = require('../../src/actions/editor');

const TransmissionBar = require('./transmission-bar');
const TransmitPane = require('./transmit-pane');

const makeToasts = require('../../src/lib/toasts');

const Scroller = require('./scroller');

function editor(app, opts, done){

  var codeEditor;
  var outputConsole;
  var transmission;
  var transmitPane;
  var scroller = new Scroller();

  // TODO: get rid of these
  editorStore.cm = cm;
  deviceStore.documents = app.documents;

  function refreshConsole(){
    const { lines } = consoleStore.getState();
    scroller.setLines(lines);
    scroller.requestRefresh();
  }

  function highlighter(position, length) {
    if(!codeEditor){
      return;
    }

    const doc = codeEditor.getDoc();

    const anchor = doc.posFromIndex(position);
    const head = doc.posFromIndex(position + length);

    doc.setSelection(anchor, head, { scroll: false });

    const charRect = codeEditor.charCoords(anchor, 'local');
    const halfHeight = codeEditor.getScrollerElement().offsetHeight / 2;
    const halfTextHeight = Math.floor((charRect.bottom - charRect.top) / 2);
    codeEditor.scrollTo(null, charRect.top - halfHeight - halfTextHeight);
  }

  consoleStore.listen(refreshConsole);

  const space = app.workspace;
  const compile = app.compile.bind(app);
  // seems strange to pass highlighter to toasts
  // maybe this should be named "handlers" or something
  const toasts = makeToasts(app.toast, highlighter);

  editorStore.toasts = toasts;
  editorStore.compile = compile;
  editorStore.workspace = space;

  // really stinks to attach these in here
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


    if(!transmitPane) {
      transmitPane = document.createElement('div');
      el.appendChild(transmitPane);
      React.render(<TransmitPane />, transmitPane);
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

      scroller.setConsole(outputConsole);

      outputConsole.addEventListener('scroll', scroller.scroll, false);
    }
    if(!transmission) {
      transmission = document.createElement('div');
      el.appendChild(transmission);
      React.render(<TransmissionBar />, transmission);
    }

    cb();
  });

  done();
}

module.exports = editor;
