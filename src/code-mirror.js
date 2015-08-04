'use strict';

const CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/dialog/dialog.css');
require('codemirror/addon/search/search');
require('codemirror/addon/selection/mark-selection');
require('codemirror/lib/codemirror.css');
require('../assets/theme/parallax.css');
require('../plugins/editor/pbasic')(CodeMirror);


const cm = new CodeMirror(null, {
  mode: 'pbasic',
  theme: 'parallax',
  lineNumbers: true
});

module.exports = cm;
