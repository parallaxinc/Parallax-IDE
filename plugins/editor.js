'use strict';

require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/neo.css');

var CodeMirror = require('codemirror');

function editor(app, opts, cb){

  var codeEditor;

  app.view('editor', function(el, cb){
    console.log('editor render');

    if(!codeEditor){
      codeEditor = CodeMirror(el, {
        value: opts.initial,
        mode: 'javascript',
        theme: 'neo',
        lineNumbers: true
      });
    }

    cb();
  });

  cb();
}

module.exports = editor;
