'use strict';

require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/neo.css');

var CodeMirror = require('codemirror');

function editor(app, opts, done){

  var codeEditor;

  var space = app.workspace;

  app.view('editor', function(el, cb){
    console.log('editor render');

    if(!codeEditor){
      codeEditor = CodeMirror(el, {
        value: space.current.deref(),
        mode: 'javascript',
        theme: 'neo',
        lineNumbers: true
      });

      codeEditor.on('change', handleChange);

      space._structure.on('swap', function(){
        var editorCursor = codeEditor.getCursor();
        var current = space.current.deref();
        if(current !== codeEditor.getValue()){
          codeEditor.setValue(current);
          codeEditor.setCursor(editorCursor);
        }
      });
    }

    cb();
  });

  function handleChange(inst){
    space.current.update(function(){
      return inst.getValue();
    });
  }

  space.current.update(function(){
    return opts.initial;
  });

  done();
}

module.exports = editor;
